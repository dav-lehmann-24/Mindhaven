import React, { useMemo, useState } from 'react';
import styles from './SOSPage.module.css';

const SOS_TYPES = [
  {
    id: 'panic',
    title: 'Panic or Anxiety',
    description: 'Fast heartbeat, racing thoughts, or a sudden wave of fear.',
    steps: [
      'Name 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, 1 you can taste.',
      'Try a slow inhale for 4, hold for 4, exhale for 6.',
      'Loosen shoulders and drop your jaw to relax the body loop.',
    ],
    resources: [
      {
        kind: 'Article',
        title: 'Understanding Panic Attacks',
        source: 'NHS',
        url: 'https://www.nhs.uk/mental-health/conditions/panic-disorder/',
      },
      {
        kind: 'Video',
        title: '5-4-3-2-1 Grounding Exercise',
        source: 'YouTube search',
        url: 'https://www.youtube.com/results?search_query=5-4-3-2-1+grounding+exercise',
      },
      {
        kind: 'Guide',
        title: 'Coping With Anxiety',
        source: 'NIMH',
        url: 'https://www.nimh.nih.gov/health/topics/anxiety-disorders',
      },
    ],
  },
  {
    id: 'depression',
    title: 'Low Mood or Depressive Episode',
    description: 'Feeling heavy, numb, or hopeless for hours or days.',
    steps: [
      'Choose one small task: drink water, open a window, or stand up and stretch.',
      'Write one sentence about how you feel right now.',
      'Reach out to someone you trust if you can.',
    ],
    resources: [
      {
        kind: 'Article',
        title: 'Depression Basics',
        source: 'WHO',
        url: 'https://www.who.int/news-room/fact-sheets/detail/depression',
      },
      {
        kind: 'Guide',
        title: 'Depression Overview',
        source: 'NIMH',
        url: 'https://www.nimh.nih.gov/health/topics/depression',
      },
      {
        kind: 'Video',
        title: 'Behavioral Activation Tips',
        source: 'YouTube search',
        url: 'https://www.youtube.com/results?search_query=behavioral+activation+for+depression',
      },
    ],
  },
  {
    id: 'stress',
    title: 'Stress or Overwhelm',
    description: 'Too many tasks, pressure, or a sense of losing control.',
    steps: [
      'Brain dump everything on your mind into a quick list.',
      'Pick the next 10-minute action only, not the whole problem.',
      'Set a short timer and take a pause after it ends.',
    ],
    resources: [
      {
        kind: 'Guide',
        title: 'Stress Management',
        source: 'WHO',
        url: 'https://www.who.int/news-room/questions-and-answers/item/stress',
      },
      {
        kind: 'Article',
        title: 'Mindfulness Basics',
        source: 'NCCIH',
        url: 'https://www.nccih.nih.gov/health/meditation-in-depth',
      },
      {
        kind: 'Video',
        title: 'Short Reset Breathing',
        source: 'YouTube search',
        url: 'https://www.youtube.com/results?search_query=short+breathing+exercise+2+minutes',
      },
    ],
  },
  {
    id: 'adhd',
    title: 'ADHD Focus or Restlessness',
    description: 'Difficulty starting, staying focused, or calming mental noise.',
    steps: [
      'Set a 5-minute start timer and begin with a tiny step.',
      'Reduce distractions: one tab, one task, one surface.',
      'Move your body for 60 seconds to reset attention.',
    ],
    resources: [
      {
        kind: 'Article',
        title: 'ADHD Overview',
        source: 'CDC',
        url: 'https://www.cdc.gov/adhd/index.html',
      },
      {
        kind: 'Guide',
        title: 'ADHD in Adults',
        source: 'NIMH',
        url: 'https://www.nimh.nih.gov/health/topics/attention-deficit-hyperactivity-disorder-adhd',
      },
      {
        kind: 'Video',
        title: 'Body Doubling Tips',
        source: 'YouTube search',
        url: 'https://www.youtube.com/results?search_query=body+doubling+adhd',
      },
    ],
  },
  {
    id: 'sleep',
    title: 'Racing Thoughts or Sleep Trouble',
    description: 'Mind is active at night or sleep feels out of reach.',
    steps: [
      'Dim lights and reduce screens for 20 minutes.',
      'Write down worries to clear them from your head.',
      'Try a slow body scan from head to toes.',
    ],
    resources: [
      {
        kind: 'Guide',
        title: 'Healthy Sleep Tips',
        source: 'CDC',
        url: 'https://www.cdc.gov/sleep/about_sleep/sleep_hygiene.html',
      },
      {
        kind: 'Article',
        title: 'Insomnia and Sleep',
        source: 'NHLBI',
        url: 'https://www.nhlbi.nih.gov/health/insomnia',
      },
      {
        kind: 'Video',
        title: 'Body Scan for Sleep',
        source: 'YouTube search',
        url: 'https://www.youtube.com/results?search_query=body+scan+sleep+meditation',
      },
    ],
  },
  {
    id: 'grief',
    title: 'Grief or Loss',
    description: 'Sadness, numbness, or waves of emotion after a loss.',
    steps: [
      'Allow yourself to feel what comes up without rushing it.',
      'Write down a memory or a message you wish you could share.',
      'Drink water and eat something small if you can.',
    ],
    resources: [
      {
        kind: 'Guide',
        title: 'Coping With Grief',
        source: 'APA',
        url: 'https://www.apa.org/topics/grief',
      },
      {
        kind: 'Article',
        title: 'Grief Basics',
        source: 'WHO',
        url: 'https://www.who.int/news-room/fact-sheets/detail/mental-health-strengthening-our-response',
      },
      {
        kind: 'Video',
        title: 'Grief Processing Talk',
        source: 'YouTube search',
        url: 'https://www.youtube.com/results?search_query=grief+coping+talk',
      },
    ],
  },
  {
    id: 'overload',
    title: 'Sensory Overload or Burnout',
    description: 'Everything feels too loud, bright, or intense.',
    steps: [
      'Lower input: reduce noise, lights, and movement.',
      'Sip water and focus on a single, steady object.',
      'Give yourself permission to pause without fixing anything.',
    ],
    resources: [
      {
        kind: 'Article',
        title: 'Understanding Burnout',
        source: 'WHO',
        url: 'https://www.who.int/news-room/questions-and-answers/item/burn-out-an-occupational-phenomenon',
      },
      {
        kind: 'Guide',
        title: 'Self-Care Basics',
        source: 'NIMH',
        url: 'https://www.nimh.nih.gov/health/topics/caring-for-your-mental-health',
      },
      {
        kind: 'Video',
        title: 'Short Grounding Reset',
        source: 'YouTube search',
        url: 'https://www.youtube.com/results?search_query=grounding+exercise+2+minutes',
      },
    ],
  },
  {
    id: 'agitation',
    title: 'Anger or Agitation',
    description: 'Feeling hot, tense, or ready to snap.',
    steps: [
      'Step away for 2 minutes and focus on your breath.',
      'Unclench your hands and release your shoulders.',
      'Name the feeling in one sentence to reduce intensity.',
    ],
    resources: [
      {
        kind: 'Article',
        title: 'Managing Anger',
        source: 'APA',
        url: 'https://www.apa.org/topics/anger',
      },
      {
        kind: 'Guide',
        title: 'Emotional Regulation Skills',
        source: 'Verywell Mind',
        url: 'https://www.verywellmind.com/emotion-regulation-skills-for-anger-5204380',
      },
      {
        kind: 'Video',
        title: 'Short Calm-Down Routine',
        source: 'YouTube search',
        url: 'https://www.youtube.com/results?search_query=calm+down+routine+anger',
      },
    ],
  },
];

const SOSPage = () => {
  const [selectedTypeId, setSelectedTypeId] = useState(null);

  const selectedType = useMemo(
    () => SOS_TYPES.find(type => type.id === selectedTypeId),
    [selectedTypeId]
  );

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <p className={styles.kicker}>SOS MODE</p>
          <h1 className={styles.title}>Find support that fits your moment.</h1>
          <p className={styles.subtitle}>
            Choose the kind of emergency you are experiencing and get focused, practical resources.
          </p>
        </div>
        <div className={styles.note}>
          If you are in immediate danger, contact your local emergency services right now.
        </div>
      </section>

      {!selectedType && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Select your emergency type</h2>
          <div className={styles.typeGrid}>
            {SOS_TYPES.map((type, index) => (
              <button
                key={type.id}
                className={styles.typeCard}
                onClick={() => setSelectedTypeId(type.id)}
                style={{ animationDelay: `${index * 0.06}s` }}
                type="button"
              >
                <div className={styles.typeHeader}>
                  <h3 className={styles.typeTitle}>{type.title}</h3>
                  <span className={styles.typeChip}>Select</span>
                </div>
                <p className={styles.typeDescription}>{type.description}</p>
              </button>
            ))}
          </div>
        </section>
      )}

      {selectedType && (
        <section className={styles.section}>
          <div className={styles.selectedHeader}>
            <div>
              <p className={styles.selectedLabel}>Selected type</p>
              <h2 className={styles.sectionTitle}>{selectedType.title}</h2>
              <p className={styles.selectedDescription}>{selectedType.description}</p>
            </div>
            <button
              className={styles.ghostButton}
              onClick={() => setSelectedTypeId(null)}
              type="button"
            >
              Change type
            </button>
          </div>

          <div className={styles.stepsCard}>
            <h3 className={styles.stepsTitle}>Try this now</h3>
            <ol className={styles.stepsList}>
              {selectedType.steps.map(step => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </div>

          <div className={styles.resourcesHeader}>
            <h3 className={styles.resourcesTitle}>Helpful resources</h3>
            <p className={styles.resourcesSubtitle}>Short, reliable, and easy to start.</p>
          </div>
          <div className={styles.resourceGrid}>
            {selectedType.resources.map((resource, index) => (
              <a
                key={`${resource.title}-${index}`}
                className={styles.resourceCard}
                href={resource.url}
                target="_blank"
                rel="noreferrer"
                style={{ animationDelay: `${index * 0.08}s` }}
              >
                <span className={styles.resourceKind}>{resource.kind}</span>
                <h4 className={styles.resourceTitle}>{resource.title}</h4>
                <p className={styles.resourceSource}>{resource.source}</p>
                <span className={styles.resourceCta}>Open resource</span>
              </a>
            ))}
          </div>
        </section>
      )}
    </main>
  );
};

export default SOSPage;
