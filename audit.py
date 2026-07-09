import json

skills = json.load(open('src/data/skills.json'))
journeys = json.load(open('src/data/journeys.json'))
resources = json.load(open('src/data/resources.json'))
collections = json.load(open('src/data/collections.json'))
edges = json.load(open('src/data/edges.json'))

skill_ids = {s['id'] for s in skills}
journey_ids = {j['id'] for j in journeys}
resource_ids = {r['id'] for r in resources}

# Map connections
skill_to_resources = {s: set() for s in skill_ids}
skill_to_journeys = {s: set() for s in skill_ids}
journey_to_skills = {j: set() for j in journey_ids}
resource_to_skills = {r: set() for r in resource_ids}

edge_counts = {s: 0 for s in skill_ids}

for e in edges:
    src = e['source_id']
    tgt = e['target_id']
    if src in skill_ids: edge_counts[src] += 1
    if tgt in skill_ids: edge_counts[tgt] += 1
    
    # Resource <-> Skill
    if src in resource_ids and tgt in skill_ids:
        skill_to_resources[tgt].add(src)
        resource_to_skills[src].add(tgt)
    elif src in skill_ids and tgt in resource_ids:
        skill_to_resources[src].add(tgt)
        resource_to_skills[tgt].add(src)
        
    # Journey <-> Skill
    if src in journey_ids and tgt in skill_ids:
        skill_to_journeys[tgt].add(src)
        journey_to_skills[src].add(tgt)
    elif src in skill_ids and tgt in journey_ids:
        skill_to_journeys[src].add(tgt)
        journey_to_skills[tgt].add(src)

orphan_skills = [s['id'] for s in skills if edge_counts[s['id']] == 0]
weakly_connected = [s['id'] for s in skills if 0 < edge_counts[s['id']] <= 2]
skills_without_journeys = [s['id'] for s in skills if len(skill_to_journeys[s['id']]) == 0]
skills_without_resources = [s['id'] for s in skills if len(skill_to_resources[s['id']]) == 0]

gap_report = {
    "metrics": {
        "total_skills": len(skills),
        "skills_with_resources": len([s for s in skill_ids if len(skill_to_resources[s]) > 0]),
        "skills_with_journeys": len([s for s in skill_ids if len(skill_to_journeys[s]) > 0]),
        "orphan_skills": len(orphan_skills),
        "weakly_connected": len(weakly_connected)
    },
    "details": {
        "orphan_skills": [s for s in skills if s['id'] in orphan_skills],
        "weakly_connected_skills": [s for s in skills if s['id'] in weakly_connected],
        "skills_without_journeys": [s for s in skills if s['id'] in skills_without_journeys],
        "skills_without_resources": [s for s in skills if s['id'] in skills_without_resources]
    }
}

with open('skill_gap_report.json', 'w') as f:
    json.dump(gap_report, f, indent=2)

print("Journey Audit:")
for j in journeys:
    print(f"\nJourney: {j['title']}")
    j_skills = journey_to_skills[j['id']]
    print(f"Skills covered: {len(j_skills)} {[s['title'] for s in skills if s['id'] in j_skills]}")
    j_resources = set()
    for phase in j.get('metadata', {}).get('phases', []):
        j_resources.update(phase.get('resources', []))
    print(f"Resources: {len(j_resources)}")
    print(f"Estimated hours: {j.get('metadata', {}).get('total_estimated_hours', 0)}")
