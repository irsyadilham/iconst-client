const token = (): string | null => {
  return localStorage.getItem('token');
}

export const getNoToken = async (url: string) => {
  try {
    const req = await fetch(`${process.env.HOST}${url}`, {
      headers: {
        'Accept': 'application/json'
      }});
    if (!req.ok) throw req;
    return await req.json();
  } catch (err) {
    throw err;
  }
}

export const get = async (url: string) => {
  try {
    const req = await fetch(`${process.env.HOST}${url}`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token()}`
      }});
    if (!req.ok) throw req;
    return await req.json();
  } catch (err) {
    throw err;
  }
}

export const post = async (url: string, data: any) => {
  try {
    const req = await fetch(`${process.env.HOST}${url}`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token()}`
      }});
    if (!req.ok) throw req;
    return await req.json();
  } catch (err) {
    throw err;
  }
}

export const postNoToken = async (url: string, data: any) => {
  try {
    const req = await fetch(`${process.env.HOST}${url}`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }});
    if (!req.ok) throw req;
    return await req.json();
  } catch (err) {
    throw err;
  }
}

export const postFormData = async (url: string, data: FormData) => {
  try {
    const req = await fetch(`${process.env.HOST}${url}`, {
      method: 'POST',
      body: data,
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token()}`
      }});
    if (!req.ok) throw req;
    return await req.json();
  } catch (err) {
    throw err;
  }
}

export const put = async (url: string, data: any) => {
  try {
    const req = await fetch(`${process.env.HOST}${url}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token()}`
      }});
    if (!req.ok) throw req;
    return await req.json();
  } catch (err) {
    throw err;
  }
}

export const del = async (url: string) => {
  try {
    const req = await fetch(`${process.env.HOST}${url}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token()}`
      }});
    if (!req.ok) throw req;
    return await req.json();
  } catch (err) {
    throw err;
  }
}