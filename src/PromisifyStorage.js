export const PromisifyStorage = (storage) => {
  
  async function setItem(key, data) {
    if( storage ) {
      storage.setItem(key, JSON.stringify(data))
    }
  }
  
  async function getItem(key) {
    if( !storage ) return null
    let data = null
    
    try {
      data = JSON.parse(storage.getItem(key))
    } catch( e ) {
      return null
    }
    
    return data
  }
  
  async function removeItem(key) {
    if( storage ) {
      storage.removeItem(key)
    }
  }
  
  return {
    setItem,
    getItem,
    removeItem,
    _storage: storage
  }
}