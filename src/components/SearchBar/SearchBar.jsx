import './SearchBar.scss'

let searchBarBgChangeTimeout = null;

export default function SearchBar({ onSubmit, inputRef }) {

    function handleOnInputChange(e) {
        if (searchBarBgChangeTimeout) return

        inputRef.current.classList.toggle('border-1')
        inputRef.current.classList.toggle('border-2')

        clearTimeout(searchBarBgChangeTimeout)
        searchBarBgChangeTimeout = setTimeout(() => {
            searchBarBgChangeTimeout = null
        }, 100)
    }

    return (
        <form className='search-bar' onSubmit={onSubmit}>
            <input className='border-1' ref={inputRef} onChange={handleOnInputChange} autoCapitalize="on" type="text" placeholder='Search for a place...'/>
            <button className='border-anim-hover'><i className="fa fa-search"></i></button>
        </form>
    )
}