import AccentEditor from './AccentEditor/components/AccentEditor';
import Nav from './Nav';

export default function Main() {
    return (
        <div className='app-container'>
            <Nav />
            <AccentEditor />
        </div>
    );
}
