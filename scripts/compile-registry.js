import fs from 'fs';
import path from 'path';

// Define paths
const __dirname = path.resolve();
const REGISTRY_PATH = path.join(__dirname, 'src', 'KnowledgeRegistry');
const DATA_PATH = path.join(__dirname, 'src', 'data');

// If the registry wasn't cloned into src/KnowledgeRegistry during build, fail gracefully or warn.
if (!fs.existsSync(REGISTRY_PATH)) {
    console.warn(`[ReadRadar Prebuild] KnowledgeRegistry not found at ${REGISTRY_PATH}. Using fallback mock data if available.`);
    process.exit(0); // For local dev, they might not have cloned the registry.
}

console.log("[ReadRadar Prebuild] Compiling KnowledgeRegistry into flat JSON files...");

// Helper to safely read JSON
function readJSONSafe(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(content);
    } catch (e) {
        console.error(`[ReadRadar Prebuild] Failed to parse ${filePath}: ${e.message}`);
        return null;
    }
}

// 1. Compile Resources (Nodes: Repositories and Books)
const resources = [];
const nodesDir = path.join(REGISTRY_PATH, 'nodes');
['repositories', 'books'].forEach(subDir => {
    const dirPath = path.join(nodesDir, subDir);
    if (fs.existsSync(dirPath)) {
        const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.json'));
        for (const file of files) {
            const node = readJSONSafe(path.join(dirPath, file));
            if (node) {
                // Map BookOS Node -> ReadRadar Resource
                // BookOS: Node(node_id, node_type, title, primary_url, content, authors, relationships, metrics)
                
                // Assuming basic mapping. Note: ReadRadar's `resources.json` has a specific schema.
                // We'll map as much as we can. Since the user said ReadRadar currently uses `data/resources.json`,
                // and BookOS outputs `Node` Pydantic models. We'll do a simple transformation.
                const resourceType = node.node_type === 'Node:Repository' ? 'Repository' : 'Book';
                
                const resource = {
                    id: node.node_id,
                    title: node.title?.value || "Unknown Title",
                    type: resourceType,
                    authorId: (node.authors && node.authors.length > 0) ? node.authors[0] : "unknown",
                    domains: ["Technology"], // Hardcoded for now if not present
                    tags: [],
                    score: 85, // Mock data for demo
                    trend_score: 90, // Mock data for demo
                    official_url: node.primary_url?.value || "#",
                    description: node.content?.raw_content || "No description provided.",
                    date_added: new Date().toISOString().split('T')[0],
                    difficulty: "Intermediate",
                    estimated_hours: 5,
                    prerequisites: [],
                    learning_outcomes: [],
                    related_resources: [],
                    skip_if: [],
                    verification: {
                        official: true,
                        community_score: 85,
                        agent_confidence: node.title?.provenance?.confidence || 1.0
                    },
                    metadata: {
                        last_verified: new Date().toISOString()
                    },
                    knowledge_dna: {}
                };
                resources.push(resource);
            }
        }
    }
});

// Ensure data dir exists
if (!fs.existsSync(DATA_PATH)) {
    fs.mkdirSync(DATA_PATH, { recursive: true });
}

fs.writeFileSync(path.join(DATA_PATH, 'resources.json'), JSON.stringify(resources, null, 2));
console.log(`[ReadRadar Prebuild] Compiled ${resources.length} resources.`);

// Note: Domains, Authors, and Collections can also be compiled if they exist in KnowledgeRegistry.
// If they don't, we will leave the existing ones in `src/data/` untouched if they exist, or mock them.

console.log("[ReadRadar Prebuild] Compilation complete.");
