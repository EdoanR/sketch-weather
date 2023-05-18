import SmallButton from '../SmallButton';
import './index.scss'

let searchBarBgChangeTimeout = null;

export default function SearchBar({ onSubmit, searchBarInputRef }) {

    function handleOnInputChange(e) {
        if (searchBarBgChangeTimeout) return

        searchBarInputRef.current.classList.toggle('border-1')
        searchBarInputRef.current.classList.toggle('border-2')

        clearTimeout(searchBarBgChangeTimeout)
        searchBarBgChangeTimeout = setTimeout(() => {
            searchBarBgChangeTimeout = null
        }, 100)
    }

    return (
        <form className='search-bar' onSubmit={onSubmit}>
            <input className='border-1' ref={searchBarInputRef} onChange={handleOnInputChange} autoCapitalize="on" type="text" placeholder='Search for a place...'/>
            <SmallButton className="animated"><i className="fa fa-search"></i></SmallButton>
        </form>
    )
}