export function createStateStore(repository) {
  let currentState = repository.load();
  return {
    getState: () => structuredClone(currentState),
    transact(change) {
      const nextState = structuredClone(currentState);
      change(nextState);
      repository.save(nextState);
      currentState = nextState;
      return structuredClone(currentState);
    },
  };
}
