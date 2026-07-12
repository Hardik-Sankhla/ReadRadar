import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const slugify = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

const skills = [
  // Programming
  { title: "Python", category: "Programming", desc: "Core language for AI/ML.", importance: 10, reqs: [] },
  { title: "TypeScript", category: "Programming", desc: "Frontend and full-stack AI integration.", importance: 8, reqs: ["javascript"] },
  { title: "JavaScript", category: "Programming", desc: "Web integrations.", importance: 8, reqs: [] },
  { title: "SQL", category: "Programming", desc: "Database querying and data manipulation.", importance: 8, reqs: [] },
  { title: "Bash", category: "Programming", desc: "Server navigation and script automation.", importance: 7, reqs: [] },
  { title: "Git", category: "Programming", desc: "Version control.", importance: 9, reqs: [] },
  { title: "C++", category: "Programming", desc: "Performance optimization.", importance: 6, reqs: [] },
  { title: "Rust", category: "Programming", desc: "Safe systems programming.", importance: 5, reqs: [] },
  
  // Machine Learning
  { title: "Linear Algebra", category: "Machine Learning", desc: "Vectors, matrices, operations.", importance: 8, reqs: ["python"] },
  { title: "Statistics", category: "Machine Learning", desc: "Distributions, significance, Bayes theorem.", importance: 7, reqs: ["python"] },
  { title: "Data Preprocessing", category: "Machine Learning", desc: "Cleaning, normalization, feature engineering.", importance: 8, reqs: ["python", "statistics"] },
  { title: "Classical ML", category: "Machine Learning", desc: "Scikit-Learn, Random Forests, XGBoost.", importance: 8, reqs: ["data-preprocessing"] },
  { title: "Dimensionality Reduction", category: "Machine Learning", desc: "PCA, t-SNE, UMAP.", importance: 6, reqs: ["linear-algebra"] },
  { title: "NLP Basics", category: "Machine Learning", desc: "Tokenization, TF-IDF.", importance: 7, reqs: ["data-preprocessing"] },
  { title: "Computer Vision Basics", category: "Machine Learning", desc: "Filters, Edge Detection.", importance: 6, reqs: ["data-preprocessing"] },
  { title: "Reinforcement Learning", category: "Machine Learning", desc: "Q-learning, policies.", importance: 7, reqs: ["classical-ml"] },

  // Deep Learning
  { title: "Deep Learning", category: "Deep Learning", desc: "Neural networks base concepts.", importance: 9, reqs: ["linear-algebra"] },
  { title: "PyTorch", category: "Deep Learning", desc: "Primary deep learning framework.", importance: 10, reqs: ["deep-learning", "python"] },
  { title: "Neural Networks", category: "Deep Learning", desc: "Perceptrons, activation functions.", importance: 9, reqs: ["deep-learning"] },
  { title: "Optimization Algorithms", category: "Deep Learning", desc: "SGD, Adam, learning rate schedules.", importance: 8, reqs: ["deep-learning"] },
  { title: "Embeddings", category: "Deep Learning", desc: "Dense vector representations.", importance: 9, reqs: ["deep-learning"] },
  { title: "CNNs", category: "Deep Learning", desc: "Image data processing.", importance: 7, reqs: ["deep-learning"] },
  { title: "RNNs", category: "Deep Learning", desc: "Sequential data processing.", importance: 6, reqs: ["deep-learning"] },

  // LLM Engineering
  { title: "Transformers", category: "LLM Engineering", desc: "Self-attention, positional encoding.", importance: 10, reqs: ["pytorch"] },
  { title: "Prompt Engineering", category: "LLM Engineering", desc: "Few-shot, chain-of-thought, system prompts.", importance: 9, reqs: ["python"] },
  { title: "RAG", category: "LLM Engineering", desc: "Retrieval-Augmented Generation.", importance: 10, reqs: ["prompt-engineering", "vector-databases"] },
  { title: "Advanced Retrieval", category: "LLM Engineering", desc: "Hybrid search, cross-encoder reranking.", importance: 9, reqs: ["rag"] },
  { title: "Agentic RAG", category: "LLM Engineering", desc: "RAG combined with agent routing.", importance: 8, reqs: ["advanced-retrieval"] },
  { title: "Vector Databases", category: "LLM Engineering", desc: "Milvus, Qdrant, Pinecone.", importance: 9, reqs: ["python"] },
  { title: "Fine-Tuning", category: "LLM Engineering", desc: "Supervised instruction tuning.", importance: 9, reqs: ["transformers"] },
  { title: "PEFT", category: "LLM Engineering", desc: "LoRA, QLoRA, adapters.", importance: 9, reqs: ["fine-tuning"] },
  { title: "Alignment", category: "LLM Engineering", desc: "RLHF, DPO.", importance: 8, reqs: ["fine-tuning"] },
  { title: "Model Quantization", category: "LLM Engineering", desc: "GGUF, AWQ, GPTQ.", importance: 8, reqs: ["transformers"] },
  { title: "LLM Evaluation", category: "LLM Engineering", desc: "LLM-as-a-judge, BLEU, ROUGE.", importance: 9, reqs: ["prompt-engineering"] },
  { title: "Synthetic Data Generation", category: "LLM Engineering", desc: "Generating training data using strong models.", importance: 7, reqs: ["prompt-engineering"] },
  { title: "Prompt Caching", category: "LLM Engineering", desc: "Context caching optimization.", importance: 7, reqs: ["prompt-engineering"] },
  { title: "Speculative Decoding", category: "LLM Engineering", desc: "Inference speed optimization.", importance: 7, reqs: ["transformers"] },

  // Agent Engineering
  { title: "Tool Calling", category: "Agent Engineering", desc: "Binding APIs to LLM outputs.", importance: 9, reqs: ["prompt-engineering"] },
  { title: "Agent Orchestration", category: "Agent Engineering", desc: "AutoGen, LangGraph, CrewAI.", importance: 9, reqs: ["tool-calling"] },
  { title: "Reasoning Frameworks", category: "Agent Engineering", desc: "ReAct, Plan-and-Solve.", importance: 9, reqs: ["tool-calling"] },
  { title: "Memory Systems", category: "Agent Engineering", desc: "Short-term context, episodic memory.", importance: 8, reqs: ["reasoning-frameworks"] },
  { title: "Multi-Agent Systems", category: "Agent Engineering", desc: "Role-based agents, collaboration.", importance: 9, reqs: ["agent-orchestration"] },
  { title: "Web Scraping", category: "Agent Engineering", desc: "Beautiful Soup, Puppeteer.", importance: 7, reqs: ["python"] },
  { title: "Semantic Router", category: "Agent Engineering", desc: "Fast intent routing.", importance: 7, reqs: ["embeddings"] },
  { title: "Browser Automation", category: "Agent Engineering", desc: "Playwright, Selenium.", importance: 8, reqs: ["web-scraping"] },

  // MLOps
  { title: "Docker", category: "MLOps", desc: "Containerization.", importance: 9, reqs: ["git", "bash"] },
  { title: "Kubernetes", category: "MLOps", desc: "Container orchestration.", importance: 8, reqs: ["docker"] },
  { title: "Experiment Tracking", category: "MLOps", desc: "MLflow, Weights & Biases.", importance: 8, reqs: ["python"] },
  { title: "CI/CD for ML", category: "MLOps", desc: "Automated testing pipelines.", importance: 8, reqs: ["model-registry"] },
  { title: "Model Registry", category: "MLOps", desc: "Versioning weights and datasets.", importance: 8, reqs: ["experiment-tracking"] },
  { title: "LLM Observability", category: "MLOps", desc: "Langfuse, Arize, latency tracking.", importance: 8, reqs: ["model-serving"] },
  { title: "Model Serving", category: "MLOps", desc: "vLLM, TGI, batching.", importance: 9, reqs: ["fastapi"] },
  { title: "A/B Testing", category: "MLOps", desc: "Online experiments.", importance: 7, reqs: ["statistics"] },
  { title: "Feature Store", category: "MLOps", desc: "Feast, Hopsworks.", importance: 7, reqs: ["data-preprocessing"] },

  // Infrastructure
  { title: "FastAPI", category: "Infrastructure", desc: "Creating endpoints for inference.", importance: 9, reqs: ["python", "docker"] },
  { title: "Serverless GPUs", category: "Infrastructure", desc: "Modal, RunPod, Baseten.", importance: 8, reqs: ["docker"] },
  { title: "Cloud Providers", category: "Infrastructure", desc: "AWS, GCP, Azure.", importance: 8, reqs: ["bash"] },
  { title: "IaC", category: "Infrastructure", desc: "Terraform, Ansible.", importance: 7, reqs: ["cloud-providers"] },

  // Research
  { title: "Mixture of Experts", category: "Research", desc: "Sparse routing, load balancing.", importance: 8, reqs: ["transformers"] },
  { title: "State Space Models", category: "Research", desc: "Mamba, recurrent architectures.", importance: 7, reqs: ["transformers"] },
  { title: "Scaling Laws", category: "Research", desc: "Compute vs. Data paradigms.", importance: 7, reqs: ["transformers"] },
  { title: "Mechanistic Interpretability", category: "Research", desc: "Understanding neuron activations.", importance: 7, reqs: ["transformers"] },
  { title: "Paper Reading", category: "Research", desc: "Reading ArXiv, implementing equations.", importance: 8, reqs: ["deep-learning"] }
];

console.log(`Generating ${skills.length} skills...`);

const outputDir = path.join(__dirname, '../src/data/nodes/skills');
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

skills.forEach(skill => {
  const slug = slugify(skill.title);
  const id = `KA-SKIL-${slug.toUpperCase()}`;
  
  const edges = {
    REQUIRES_SKILL: skill.reqs.map(reqSlug => `KA-SKIL-${reqSlug.toUpperCase()}`)
  };

  const node = {
    id,
    title: skill.title,
    slug,
    category: skill.category,
    description: skill.desc,
    importance: skill.importance,
    edges
  };

  fs.writeFileSync(
    path.join(outputDir, `${slug}.json`),
    JSON.stringify(node, null, 2)
  );
});

console.log('Skill nodes generated successfully.');
