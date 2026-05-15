import './Nav.css';
import { useI18n } from '../i18n';

export default function Nav() {
    const { t } = useI18n();

    return (
        <header className='nav'>
            <a className='skip-link' href='#main-content'>
                {t.skipToContent}
            </a>
            <div className='nav-brand' aria-label={t.faviconAltBrand}>
                <a className='nav-title' href='#main-content'>
                    <img className='logo' src='images/logo.png' alt='' aria-hidden='true' />
                    <span className='title'>{t.faviconAltBrand}</span>
                </a>
            </div>
        </header>
    );
}
