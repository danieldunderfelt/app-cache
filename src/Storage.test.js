import Storage from './Storage'

describe('storage', () => {
  
  /**
   * These tests use mocked storage provided by the [jest-localstorage-mock](https://github.com/clarkbw/jest-localstorage-mock) module.
   */
  
  beforeEach(() => {
    // values stored in tests will also be available in other tests unless you run
    localStorage.clear()
    sessionStorage.clear()
  })
  
  it('has a storage backend', () => {
    const storage = Storage('test')
    expect(storage._storageApi._storage).toBe(localStorage)
  })
  
  it('can receive another storage backend', () => {
    const storage = Storage('test', false, SessionStorage)
    expect(storage._storageApi._storage).toBe(sessionStorage)
  })
  
  it('can persist data', async () => {
    const storage = Storage('test')
    
    await storage.put('value')
    
    expect(localStorage.setItem).toHaveBeenLastCalledWith('test', JSON.stringify('value'))
  })
  
  it('gets data from cache', async () => {
    const storage = Storage('test')
    await storage.put('value')
    
    expect(localStorage.setItem).toHaveBeenLastCalledWith('test', JSON.stringify('value'))
    
    const value = await storage.get()
    
    expect(value).toBe('value')
    expect(localStorage.getItem).not.toHaveBeenCalled() // Value retrieved from cache
  })
  
  it('gets data from storage', async () => {
    const storage = Storage('test')
    await storage.put('value')
    
    expect(localStorage.setItem).toHaveBeenLastCalledWith('test', JSON.stringify('value'))
    storage._clearCache()
    
    const value = await storage.get()
    
    expect(value).toBe('value')
    expect(localStorage.getItem).toHaveBeenLastCalledWith('test')
  })
  
  it('removes data from storage', async () => {
    const storage = Storage('test')
    await storage.put('value')
    
    expect(localStorage.setItem).toHaveBeenLastCalledWith('test', JSON.stringify('value'))
    
    await storage.remove()
    
    expect(localStorage.removeItem).toHaveBeenLastCalledWith('test')
    expect(localStorage.__STORE__[ 'test' ]).toBeFalsy()
  })
  
  it('clears the cache when data is removed', async () => {
    const storage = Storage('test')
    await storage.put('value')
    
    expect(localStorage.setItem).toHaveBeenLastCalledWith('test', JSON.stringify('value'))
    
    await storage.remove()
    
    const value = await storage.get()
    
    expect(value).toBeNull() // The value is null
    expect(localStorage.getItem).toHaveBeenLastCalledWith('test') // We know the cache is empty because it tried to get the value from storage
  })
})