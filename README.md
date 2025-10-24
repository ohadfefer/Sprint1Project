# Minesweeper Game

A classic Minesweeper game built with vanilla HTML, CSS, and JavaScript. This project demonstrates fundamental web development concepts including DOM manipulation, game logic, and responsive design.

## 🎮 Game Features

### Core Gameplay
- **Classic Minesweeper mechanics**: Click to reveal cells, right-click to flag mines
- **Three difficulty levels**: Beginner (4x4), Medium (8x8), and Expert (12x12)
- **Lives system**: Players have 3 lives - hitting a mine costs one life
- **Hint system**: 3 hints available per game to reveal surrounding cells temporarily
- **Timer**: Tracks game completion time
- **Mine counter**: Shows remaining unflagged mines

### Visual Elements
- **Responsive design**: Works on different screen sizes
- **Modern UI**: Clean, professional styling with hover effects
- **Emoji-based icons**: Mines (💣), flags (🚩), lives (💖), hints (💡)
- **Visual feedback**: Different cell states and animations
- **Difficulty buttons**: Styled with modern CSS effects

## 🚀 How to Play

1. **Start the game**: Choose a difficulty level (Beginner, Medium, or Expert)
2. **First click**: Click any cell to start - mines are placed after your first move
3. **Reveal cells**: Left-click on cells to reveal them
4. **Flag mines**: Right-click on suspected mine locations to flag them
5. **Use hints**: Click the 💡 icons to temporarily reveal surrounding cells
6. **Win condition**: Reveal all non-mine cells
7. **Lose condition**: Hit 3 mines (lose all lives)

## 📁 Project Structure

```
Sprint1Project/
├── index.html          # Main HTML file
├── css/
│   └── app.css         # All styling and responsive design
├── js/
│   ├── game.js         # Core game logic and mechanics
│   └── utils.js        # Utility functions (rendering, random generation)
└── README.md           # This file
```

## 🛠️ Technical Implementation

### HTML Structure
- Semantic HTML5 structure
- Responsive viewport meta tag
- Clean separation of content and presentation

### CSS Features
- **Flexbox layout**: Centered, responsive design
- **CSS Grid**: Not used, but could be implemented for board layout
- **Custom properties**: CSS variables for consistent theming
- **Advanced selectors**: Complex CSS selectors for styling
- **Transitions**: Smooth hover and state change animations
- **Box shadows**: Modern depth effects
- **Fixed positioning**: Header and control elements

### JavaScript Functionality
- **Game state management**: Comprehensive game object tracking
- **Board generation**: Dynamic board creation with mine placement
- **Event handling**: Click and right-click event management
- **Recursive algorithms**: Cell expansion and mine counting
- **Timer implementation**: Game timing with setInterval
- **DOM manipulation**: Dynamic content updates
- **Game logic**: Win/lose conditions, hint system, lives management

## 🎯 Key Functions

### Game Logic (`game.js`)
- `onInit()`: Initialize game state and board
- `buildBoard()`: Create game board structure
- `setMinesAtRand()`: Place mines randomly (avoiding first click)
- `setMinesNegsCount()`: Calculate adjacent mine counts
- `expandReveal()`: Recursive cell revelation
- `onCellClicked()`: Handle cell clicks and game progression
- `onCellMarked()`: Handle right-click flagging
- `checkGameOver()`: Determine win/lose conditions

### Utility Functions (`utils.js`)
- `renderBoard()`: Generate HTML table from board matrix
- `renderCell()`: Update individual cell content
- `getRandomInt()`: Generate random integers
- `makeId()`: Generate random IDs
- `getRandomColor()`: Generate random colors

## 🎨 Design Highlights

- **Modern aesthetics**: Clean, professional appearance
- **Responsive layout**: Adapts to different screen sizes
- **Visual hierarchy**: Clear information organization
- **Interactive feedback**: Hover states and transitions
- **Accessibility**: Proper contrast and readable fonts
- **Mobile-friendly**: Touch-friendly button sizes

## 🚀 Getting Started

1. **Clone or download** the project files
2. **Open `index.html`** in any modern web browser
3. **No build process required** - pure vanilla web technologies
4. **Start playing** by selecting a difficulty level

## 🔧 Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Any modern browser supporting ES6+ features

## 📱 Responsive Design

The game is designed to work on:
- Desktop computers
- Tablets
- Mobile phones
- Different screen orientations

## 🎓 Learning Outcomes

This project demonstrates:
- **DOM manipulation** and event handling
- **Game state management** and logic
- **CSS styling** and responsive design
- **JavaScript algorithms** (recursion, random generation)
- **User interface design** principles
- **Code organization** and modularity

## 🏆 Future Enhancements

Potential improvements could include:
- High score tracking
- Sound effects
- More difficulty levels
- Custom board sizes
- Theme customization
- Multiplayer support
- Mobile app version

---

**Built with ❤️ using vanilla HTML, CSS, and JavaScript**
