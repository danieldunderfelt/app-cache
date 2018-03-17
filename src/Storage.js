export const Storage = storageApi => (storageKey, observeOn = {}, serializer = val => val) => {
  
  let cache = null
  
  async function get(emptyVal = null) {
    if( cache ) return cache
    return await storageApi
      .getItem(storageKey)
      .then(result => result === null ? emptyVal : result)
  }
  
  async function put(data) {
    await storageApi.setItem(storageKey, serializer(data))
    cache = !data ? null : data
  }
  
  async function remove() {
    await storageApi.removeItem(storageKey)
    cache = null
  }
  
  function clearCache() {
    cache = null
  }
  
  function persist() {
    if( !observeOn ) return false
    
    const val = observeOn[ storageKey ]
    put(val)
  }
  
  return {
    get,
    put,
    remove,
    persist,
    _clearCache: clearCache,
    _storageApi: storageApi
  }
}