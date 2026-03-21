#!/bin/bash
# kickstartjam.sh
#
# Sets up a game jam project by replacing the default values.
# Run this once after cloning to customize the project with your own
# title, description, author, itch.io and GitHub usernames, colors,
# and help instructions.

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "=== Kickstart Jam ==="
echo "Customize this project by answering the prompts below."
echo "Press Enter to keep the default value shown in brackets."
echo ""

# Prompt helper: reads a value with a default fallback.
# The prompt text is shown on the terminal; the chosen value is echoed to stdout.
prompt() {
    local prompt_text="$1"
    local default="$2"
    local value
    read -p "$prompt_text [$default]: " value
    echo "${value:-$default}"
}

TITLE=$(prompt "Game title" "Jam Base Code")

# Auto-derive a URL-safe slug from the title (lowercase, hyphens).
DEFAULT_SLUG=$(echo "$TITLE" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/-/g' | sed 's/-\+/-/g' | sed 's/^-\|-$//g')
REPO=$(prompt "GitHub repository / itch.io game slug" "$DEFAULT_SLUG")

DESCRIPTION=$(prompt "Short description" "Jummy")
AUTHOR=$(prompt "Author name" "Quinten")
GITHUB_USER=$(prompt "GitHub username" "Quinten")
ITCH_USER=$(prompt "Itch.io username" "supernapie")

echo ""
echo "Colors (hex values, e.g. #ff0000):"
STROKE=$(prompt "Stroke color" "#ffffff")
FILL=$(prompt "Fill color" "#ffffff")
BG=$(prompt "Background color" "#000000")

echo ""
echo "Enter help instructions (type '---' on its own line to finish):"
HELP_TEXT=""
while IFS= read -r line; do
    [[ "$line" == "---" ]] && break
    HELP_TEXT+="$line"$'\n'
done
if [ -z "$HELP_TEXT" ]; then
    HELP_TEXT="Short but helpful instructions
on how to play this game.
"
fi

echo ""
echo "Applying changes..."

# Write help text to a temp file to safely pass multi-line content to Python.
HELP_TMPFILE=$(mktemp)
printf '%s' "$HELP_TEXT" > "$HELP_TMPFILE"

python3 - "$TITLE" "$REPO" "$DESCRIPTION" "$AUTHOR" "$GITHUB_USER" "$ITCH_USER" "$STROKE" "$FILL" "$BG" "$HELP_TMPFILE" <<'PYEOF'
import sys
import json

title, repo, description, author, github_user, itch_user, stroke, fill, bg, help_file = sys.argv[1:]

with open(help_file, 'r') as f:
    help_text = f.read()

# package.json
with open('package.json', 'r') as f:
    pkg = json.load(f)

pkg['name'] = repo
pkg['description'] = description
pkg['author'] = author
pkg['homepage'] = f'https://github.com/{github_user}/{repo}#readme'
pkg['bugs']['url'] = f'https://github.com/{github_user}/{repo}/issues'
pkg['repository']['url'] = f'git+https://github.com/{github_user}/{repo}.git'
pkg['scripts']['itch'] = f'npm run clean && npm run build && butler push dist {itch_user}/{repo}:HTML'

with open('package.json', 'w') as f:
    json.dump(pkg, f, indent=2)
    f.write('\n')

# src/index.html
import html as html_module

with open('src/index.html', 'r') as f:
    content = f.read()
html_title = html_module.escape(title)
content = content.replace('<title>Jam Base Code</title>', f'<title>{html_title}</title>')
with open('src/index.html', 'w') as f:
    f.write(content)

# src/manifest.webmanifest
with open('src/manifest.webmanifest', 'r') as f:
    manifest = json.load(f)
manifest['name'] = title
manifest['background_color'] = bg
manifest['theme_color'] = fill
with open('src/manifest.webmanifest', 'w') as f:
    json.dump(manifest, f, indent=2)
    f.write('\n')

# src/states/menu.js
with open('src/states/menu.js', 'r') as f:
    content = f.read()
js_title = title.replace('\\', '\\\\').replace("'", "\\'")
content = content.replace(
    "titletext({state: menu, text: 'Jam Base Code'})",
    f"titletext({{state: menu, text: '{js_title}'}})")
content = content.replace(
    "menu.emit('color', { stroke: '#ffffff', fill: '#ffffff', bg: '#000000' })",
    f"menu.emit('color', {{ stroke: '{stroke}', fill: '{fill}', bg: '{bg}' }})")
with open('src/states/menu.js', 'w') as f:
    f.write(content)

# src/states/help.js
with open('src/states/help.js', 'r') as f:
    content = f.read()
content = content.replace(
    '\nShort but helpful instructions\non how to play this game.\n',
    '\n' + help_text)
with open('src/states/help.js', 'w') as f:
    f.write(content)

# README.md
with open('README.md', 'r') as f:
    content = f.read()
content = content.replace('# Jam Base Code', f'# {title}')
content = content.replace('Jummy!', description)
with open('README.md', 'w') as f:
    f.write(content)

PYEOF

rm "$HELP_TMPFILE"

echo ""
echo "Project configured successfully!"
echo ""
echo "  Title:       $TITLE"
echo "  Slug:        $REPO"
echo "  Description: $DESCRIPTION"
echo "  Author:      $AUTHOR"
echo "  GitHub:      github.com/$GITHUB_USER/$REPO"
echo "  Itch.io:     $ITCH_USER.itch.io/$REPO"
echo "  Colors:      stroke=$STROKE  fill=$FILL  bg=$BG"
