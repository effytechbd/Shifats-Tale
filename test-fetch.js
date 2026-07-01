const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const { data, error } = await supabase
    .from("vw_public_site_page_sections")
    .select("*")
    .eq("section_key", "GALLERY_ALBUMS")
    .maybeSingle();
    
  if (error) console.error("Error", error);
  else {
    const albums = data?.content?.albums || [];
    console.log("Found albums:", albums.length);
    console.log("Album IDs:", albums.map(a => a.id).join(", "));
  }
}
test();
