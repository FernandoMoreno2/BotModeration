export function isContextProviderHandler(obj) {
    return 'context' in obj && 'execute' in obj && typeof obj.execute === 'function';
}
//# sourceMappingURL=ContextProvider.js.map