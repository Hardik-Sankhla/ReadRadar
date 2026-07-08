import fs from 'fs';
import path from 'path';

// Define paths
const __dirname = path.resolve();
const DATA_PATH = path.join(__dirname, 'src', 'data');

// Try src/KnowledgeRegistry first (used in CI), then fallback to ../KnowledgeRegistry (used locally)
let REGISTRY_PATH = path.join(__dirname, 'src', 'KnowledgeRegistry');
if (!fs.existsSync(REGISTRY_PATH)) {
    REGISTRY_PATH = path.join(__dirname, '..', 'KnowledgeRegistry');
}

// If the registry wasn't found at all, fail gracefully or warn.
if (!fs.existsSync(REGISTRY_PATH)) {
    console.warn(`[ReadRadar Prebuild] KnowledgeRegistry not found. Using fallback mock data if available.`);
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

// 1. Compile Resources (Nodes: Repositories, Books, Papers, Models)
const resources = [];
const collections = [];
const journeys = [];
const nodesDir = path.join(REGISTRY_PATH, 'nodes');
['repositories', 'books', 'papers', 'models', 'collections', 'journeys'].forEach(subDir => {
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
                if (node.node_type === 'Node:Collection') {
                    collections.push({
                        id: node.node_id,
                        title: node.title?.value || "Unknown Collection",
                        description: node.description?.value || "",
                        resources: [] // To be filled using edges
                    });
                    continue;
                }
                
                if (node.node_type === 'Node:Journey') {
                    journeys.push({
                        id: node.node_id,
                        title: node.title?.value || "Unknown Journey",
                        description: node.description?.value || "",
                        metadata: node.extended_metadata?.value || {}
                    });
                    continue;
                }
                
                let resourceType = 'Unknown';
                if (node.node_type === 'Node:Repository') resourceType = 'Repository';
                else if (node.node_type === 'Node:Book') resourceType = 'Book';
                else if (node.node_type === 'Node:Paper') resourceType = 'Paper';
                else if (node.node_type === 'Node:Model') resourceType = 'Model';
                
                const meta = node.extended_metadata?.value || {};
                const tags = meta.tags || meta.categories || [];
                
                const resource = {
                    id: node.node_id,
                    title: node.title?.value || "Unknown Title",
                    type: resourceType,
                    authorId: meta.authors ? meta.authors[0] : (meta.author || "unknown"),
                    domains: ["Technology"], 
                    tags: tags.slice(0, 5),
                    score: node.quality_score || 85,
                    trend_score: node.trust_score || 90,
                    official_url: node.primary_url?.value || "#",
                    description: node.description?.value || "No description provided.",
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

const edges = [];
const edgesDir = path.join(REGISTRY_PATH, 'edges');
if (fs.existsSync(edgesDir)) {
    const files = fs.readdirSync(edgesDir).filter(f => f.endsWith('.json'));
    for (const file of files) {
        const edge = readJSONSafe(path.join(edgesDir, file));
        if (edge) {
            edges.push(edge);
        }
    }
}

fs.writeFileSync(path.join(DATA_PATH, 'resources.json'), JSON.stringify(resources, null, 2));
fs.writeFileSync(path.join(DATA_PATH, 'collections.json'), JSON.stringify(collections, null, 2));
fs.writeFileSync(path.join(DATA_PATH, 'journeys.json'), JSON.stringify(journeys, null, 2));
fs.writeFileSync(path.join(DATA_PATH, 'edges.json'), JSON.stringify(edges, null, 2));
console.log(`[ReadRadar Prebuild] Compiled ${resources.length} resources, ${collections.length} collections, ${journeys.length} journeys, and ${edges.length} edges.`);

// 2. Compile Intelligence Evaluation Report
const EVAL_REPORT_PATH = path.join(REGISTRY_PATH, 'evaluation', 'system_report.json');
const defaultIntelligenceReport = {
    evaluated_at: null,
    overall_pass: false,
    summary: {
        total_nodes: 0,
        total_edges: 0,
        orphan_rate: 0,
        duplicate_rate: 0,
        collection_coverage: 0,
        recommendation_coverage: 0,
        graph_utilization: 0,
        journey_count: 0,
        phase_balance_score: 0,
        graph_pass: false,
        recommendations_pass: false,
        journeys_pass: false,
    }
};

let intelligenceReport = defaultIntelligenceReport;
if (fs.existsSync(EVAL_REPORT_PATH)) {
    const evalData = readJSONSafe(EVAL_REPORT_PATH);
    if (evalData) {
        intelligenceReport = evalData;
        console.log(`[ReadRadar Prebuild] Compiled evaluation report from ${EVAL_REPORT_PATH}`);
    }
} else {
    console.warn('[ReadRadar Prebuild] evaluation/system_report.json not found. Using defaults.');
}

fs.writeFileSync(path.join(DATA_PATH, 'intelligence_report.json'), JSON.stringify(intelligenceReport, null, 2));

console.log("[ReadRadar Prebuild] Compilation complete.");
