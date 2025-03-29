const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
};

Deno.serve({ port: 8080 }, async (req) => {
  // Changed port to 8080
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const headers = {
      Authorization: `Bearer ${Deno.env.get('GOOGLE_ACCESS_TOKEN')}`,
    };

    const folderId = '19gbsQehWmDAhDN0gqmJkGrjSyJ7ABXLh';
    const url = `https://www.googleapis.com/drive/v3/files?q='${folderId}' in parents and mimeType contains 'image/'&fields=files(id,name,thumbnailLink,webContentLink)&pageSize=100`;

    const response = await fetch(url, { headers });
    const data = await response.json();

    return new Response(JSON.stringify(data.files), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch images' }), {
      status: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    });
  }
});
