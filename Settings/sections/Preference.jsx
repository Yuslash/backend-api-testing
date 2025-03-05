import colorPalettes from './ColorPalettes'

const Preferences = ({ theme, setTheme }) => {
  return (
    <div className="flex flex-wrap gap-4 p-4 bg-gray-900/50 backdrop-blur-md rounded-xl border border-gray-700">
      {Object.keys(colorPalettes).map((t) => (
        <button
          key={t}
          onClick={() => setTheme(t)}
          className={`w-12 h-12 rounded-full border-4 transition-all duration-300 ${colorPalettes[t].primary} ${theme === t ? 'ring-4 ring-white' : ''}`}
        ></button>
      ))}
    </div>
  )
}

export default Preferences
