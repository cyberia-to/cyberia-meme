# Deploy the cyberia.meme site → cyberproxy:/var/www/html/cyberia.meme/
#
#   nu scripts/deploy.nu

def main [] {
  let root = (
    if ($"($env.PWD)/index.html" | path exists) { $env.PWD }
    else { error make {msg: "run from cyberia-meme root"} }
  )
  print "→ rsync → cyberproxy:/var/www/html/cyberia.meme/"
  ^ssh cyberproxy "mkdir -p /var/www/html/cyberia.meme"
  ^rsync -az --delete --exclude ".git" --exclude "scripts" --exclude "README.md" $"($root)/" "cyberproxy:/var/www/html/cyberia.meme/"
  print "✓ deployed → https://cyberia.meme/"
}
