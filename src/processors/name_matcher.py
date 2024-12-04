from rapidfuzz import process, fuzz

def find_closest_name(name, master_names, threshold):
    """Find the closest matching name using fuzzy matching."""
    if not isinstance(name, str):
        return None
        
    result = process.extractOne(
        name,
        master_names,
        scorer=fuzz.ratio,
        score_cutoff=threshold
    )
    return result[0] if result else None