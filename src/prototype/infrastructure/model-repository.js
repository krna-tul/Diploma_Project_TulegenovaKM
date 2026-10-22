export function createModelRepository(fetchResource) {
  return {
    async load(url = 'matching/model.json') {
      const response = await fetchResource(url);
      if (!response.ok) throw new Error(`Model request failed: HTTP ${response.status}`);
      const model = await response.json();
      const vectors = ['coef', 'mean', 'scale'];
      const validVectors = vectors.every(
        (key) => model[key]?.length === 5 && model[key].every(Number.isFinite),
      );
      if (
        !model.skills?.length ||
        !model.courses?.length ||
        !validVectors ||
        model.scale.some((value) => value <= 0) ||
        !Number.isFinite(model.intercept) ||
        !Number.isFinite(model.threshold)
      )
        throw new Error('Invalid matching model.');
      return model;
    },
  };
}
