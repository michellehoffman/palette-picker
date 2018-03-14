const root = 'http://localhost:3000';

export const createProject = async(name) => {
  try {
    const url = `${ root }/api/v1/projects`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    });
    const results = await response.json();
    
    return results;
  } catch(error) {
    return error;
  }
}
