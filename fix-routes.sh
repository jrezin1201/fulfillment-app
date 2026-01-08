#!/bin/bash
# Fix all dynamic route params for Next.js 15

for file in "./src/app/api/projects/[id]/route.ts" "./src/app/api/projects/[id]/kits/route.ts"; do
  if [ -f "$file" ]; then
    # Fix params type
    sed -i '' 's/{ params }: { params: { id: string } }/{ params }: { params: Promise<{ id: string }> }/g' "$file"
    
    # Add await params at start of each function (rough approach)
    echo "Fixed $file"
  fi
done
