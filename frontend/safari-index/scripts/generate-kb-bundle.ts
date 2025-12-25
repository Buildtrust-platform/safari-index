/**
 * Generate KB Bundle for Backend Sync
 *
 * This script generates a JSON bundle of KB data that can be
 * synced to the backend for use in prompt injection.
 *
 * Run with: npx ts-node --project scripts/tsconfig.json scripts/generate-kb-bundle.ts
 */

import * as fs from 'fs';
import * as path from 'path';

// Import KB data
import { evidenceCards, bannedPhrases, topics } from '../app/content/kb';

interface TopicMetadata {
  topic_id: string;
  title: string;
  bucket: string;
  destinations: string[];
  tags: string[];
}

interface KBBundle {
  version: string;
  synced_at: string;
  evidence: Record<string, unknown>;
  banned_phrases: typeof bannedPhrases;
  topics: Record<string, TopicMetadata>;
}

// Convert topics to metadata format
const topicMetadata: Record<string, TopicMetadata> = {};
for (const [id, topic] of Object.entries(topics)) {
  topicMetadata[id] = {
    topic_id: topic.topic_id,
    title: topic.title,
    bucket: topic.bucket,
    destinations: topic.destinations,
    tags: inferTagsFromTopic(topic),
  };
}

/**
 * Infer tags from topic metadata for evidence retrieval
 */
function inferTagsFromTopic(topic: typeof topics[string]): string[] {
  const tags: string[] = [];

  // Add bucket as tag
  tags.push(topic.bucket.replace('_', '-'));

  // Add destinations as tags
  for (const dest of topic.destinations) {
    tags.push(dest.toLowerCase());
  }

  // Infer additional tags from topic_id
  const id = topic.topic_id;
  if (id.includes('tz-') || id.includes('tanzania')) tags.push('tanzania');
  if (id.includes('ke-') || id.includes('kenya')) tags.push('kenya');
  if (id.includes('bw-') || id.includes('botswana')) tags.push('botswana');
  if (id.includes('sa-') || id.includes('south-africa')) tags.push('south-africa');
  if (id.includes('rwanda')) tags.push('rwanda');
  if (id.includes('uganda')) tags.push('uganda');
  if (id.includes('serengeti')) tags.push('serengeti');
  if (id.includes('mara') || id.includes('masai')) tags.push('masai-mara');
  if (id.includes('okavango')) tags.push('okavango');
  if (id.includes('kruger')) tags.push('kruger');

  // Topic type tags
  if (id.includes('budget') || id.includes('cost') || id.includes('cheap')) tags.push('cost');
  if (id.includes('timing') || id.includes('season') || id.includes('when')) tags.push('timing');
  if (id.includes('migration')) tags.push('migration');
  if (id.includes('gorilla')) tags.push('gorillas');

  return [...new Set(tags)]; // Dedupe
}

// Build bundle
const bundle: KBBundle = {
  version: '1.0.0',
  synced_at: new Date().toISOString(),
  evidence: evidenceCards,
  banned_phrases: bannedPhrases,
  topics: topicMetadata,
};

// Output path
const outputPath = path.join(__dirname, '..', 'kb-bundle.json');

// Write bundle
fs.writeFileSync(outputPath, JSON.stringify(bundle, null, 2));

console.log(`KB bundle generated at: ${outputPath}`);
console.log(`  Evidence cards: ${Object.keys(evidenceCards).length}`);
console.log(`  Topics: ${Object.keys(topicMetadata).length}`);
console.log(`  Banned words: ${bannedPhrases.banned_words.length}`);
