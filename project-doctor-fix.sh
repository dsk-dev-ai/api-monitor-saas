#!/bin/bash

set +e

PROJECT="$HOME/Downloads/api-monitor-saas-v1"

echo "================================================="
echo " API Monitor SaaS - Project Doctor & Auto Fix"
echo "================================================="

cd "$PROJECT" || exit 1

echo ""
echo "========== SYSTEM =========="
node -v
npm -v
docker --version 2>/dev/null || echo "Docker not installed"

echo ""
echo "========== ENV =========="

if [ ! -f ".env" ] && [ -f ".env.example" ]; then
cp .env.example .env
echo "Created .env from .env.example"
fi

echo ""
echo "========== PRISMA FLAGS =========="

export PRISMA_SKIP_POSTINSTALL_GENERATE=1
export PRISMA_GENERATE_SKIP_AUTOINSTALL=1

fix_service() {

```
SERVICE=$1

echo ""
echo "================================================="
echo "Checking $SERVICE"
echo "================================================="

cd "$PROJECT/$SERVICE" || return

if [ ! -f package.json ]; then
    echo "No package.json"
    return
fi

echo ""
echo "Cleaning"

rm -rf node_modules

echo ""
echo "Installing"

npm install --no-audit --no-fund

echo ""
echo "Checking TypeScript"

if grep -q '"typescript"' package.json; then

    if [ ! -f node_modules/.bin/tsc ]; then
        echo "Installing TypeScript"
        npm install typescript --save-dev
    fi

    npx tsc --version
fi

echo ""
echo "Checking Prisma"

if grep -R "PrismaClient" src >/dev/null 2>&1; then

    echo "Prisma detected"

    if [ -f "$PROJECT/backend/prisma/schema.prisma" ]; then

        echo "Backend schema found"

        npm install prisma@5.22.0 --save-dev --save-exact
        npm install @prisma/client@5.22.0 --save-exact

        npx prisma generate \
        --schema="$PROJECT/backend/prisma/schema.prisma" \
        || echo "Prisma generate skipped"

    else

        echo "Schema not found"

    fi
else

    echo "No Prisma usage detected"

fi

echo ""
echo "Running Build"

npm run build > build.log 2>&1

if [ $? -eq 0 ]; then

    echo "BUILD SUCCESS"

else

    echo "BUILD FAILED"

    echo ""
    echo "Top Errors"

    grep -i "error" build.log | head -20

    echo ""
    echo "Last 30 Lines"

    tail -30 build.log

fi

echo ""
echo "Dependency Check"

npm ls --depth=0 >/dev/null 2>&1

if [ $? -eq 0 ]; then
    echo "Dependencies OK"
else
    echo "Dependency Issues Found"
fi
```

}

fix_service backend
fix_service worker
fix_service frontend

echo ""
echo "========== DOCKER =========="

cd "$PROJECT"

docker compose config >/tmp/docker-check.log 2>&1

if [ $? -eq 0 ]; then
echo "docker-compose valid"
else
echo "docker-compose has errors"
cat /tmp/docker-check.log
fi

echo ""
echo "========== DOCKERIGNORE =========="

for D in backend worker frontend
do

```
if [ ! -f "$PROJECT/$D/.dockerignore" ]; then
```

cat > "$PROJECT/$D/.dockerignore" <<EOF
node_modules
dist
.next
coverage
.git
.env
EOF

```
    echo "Created $D/.dockerignore"

fi
```

done

echo ""
echo "========== REPORT =========="

echo "Backend:"
if [ -f "$PROJECT/backend/build.log" ]; then
tail -5 "$PROJECT/backend/build.log"
fi

echo ""
echo "Worker:"
if [ -f "$PROJECT/worker/build.log" ]; then
tail -5 "$PROJECT/worker/build.log"
fi

echo ""
echo "Frontend:"
if [ -f "$PROJECT/frontend/build.log" ]; then
tail -5 "$PROJECT/frontend/build.log"
fi

echo ""
echo "================================================="
echo " COMPLETE"
echo "================================================="
echo ""
echo "Next:"
echo "docker compose build --no-cache"
echo "docker compose up -d"
