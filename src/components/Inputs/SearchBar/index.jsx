import InputText from '../InputText';
import SmallButton from '../SmallButton';
import './index.scss'

export default function SearchBar({ onSubmit, searchBarInputRef }) {
    return (
        <form className='search-bar' onSubmit={onSubmit}>
            <InputText ref={searchBarInputRef} autoCapitalize="on" placeholder='Search for a place...'/>
            <SmallButton className="animated"><i className="fa fa-search"></i></SmallButton>
        </form>
    )
}