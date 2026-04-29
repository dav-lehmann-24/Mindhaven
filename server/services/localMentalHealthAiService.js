const { execFile } = require('child_process');
const path = require('path');

const PYTHON_BIN = process.env.LOCAL_AI_PYTHON || 'python3';
const SCRIPT_PATH = path.join(__dirname, '..', 'python', 'mental_health_ai.py');

exports.generateMentalHealthSupport = (userMessage) =>
  new Promise((resolve, reject) => {
    execFile(
      PYTHON_BIN,
      [SCRIPT_PATH, userMessage],
      {
        cwd: path.join(__dirname, '..'),
        timeout: Number(process.env.LOCAL_AI_TIMEOUT_MS || 120000),
        maxBuffer: 1024 * 1024,
      },
      (error, stdout, stderr) => {
        if (error) {
          const serviceError = new Error('Local AI process failed');
          serviceError.statusCode = 500;
          serviceError.details = {
            stderr: (stderr || '').trim().slice(0, 500),
          };
          reject(serviceError);
          return;
        }

        let payload = null;
        try {
          payload = JSON.parse(stdout);
        } catch (parseError) {
          const serviceError = new Error('Local AI returned invalid JSON');
          serviceError.statusCode = 502;
          serviceError.details = {
            stdoutSnippet: (stdout || '').trim().slice(0, 500),
            stderr: (stderr || '').trim().slice(0, 500),
          };
          reject(serviceError);
          return;
        }

        if (!payload || typeof payload.reply !== 'string' || !payload.reply.trim()) {
          const serviceError = new Error(payload && payload.error ? payload.error : 'Local AI returned an empty response');
          serviceError.statusCode = 502;
          serviceError.details = payload && payload.details ? payload.details : undefined;
          reject(serviceError);
          return;
        }

        resolve(payload.reply.trim());
      }
    );
  });
