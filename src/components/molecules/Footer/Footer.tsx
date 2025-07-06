import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { createUseStyles } from 'react-jss';
import { FaGithub, FaLinkedin, FaTwitter, FaEnvelope } from 'react-icons/fa';

const useStyles = createUseStyles((theme: any) => ({
    footer: {
        backgroundColor: theme.palette.background.primary.primary500,
        color: theme.palette.text.primary.primary200,
        padding: '3rem 1rem',
        marginTop: 'auto',
    },
    container: {
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '2rem',
    },
    section: {
        padding: '0 1rem',
    },
    title: {
        fontSize: '1.25rem',
        fontWeight: 600,
        marginBottom: '1.5rem',
        color: theme.palette.text.primary.primary100,
    },
    link: {
        display: 'block',
        color: theme.palette.text.primary.primary200,
        marginBottom: '0.75rem',
        textDecoration: 'none',
        transition: 'color 0.3s ease',
        '&:hover': {
            color: theme.palette.text.primary.primary300,
        },
    },
    socialLinks: {
        display: 'flex',
        gap: '1rem',
        marginTop: '1rem',
    },
    socialLink: {
        color: theme.palette.text.primary.primary200,
        fontSize: '1.5rem',
        transition: 'color 0.3s ease',
        '&:hover': {
            color: theme.palette.text.primary.primary300,
        },
    },
    copyright: {
        textAlign: 'center',
        marginTop: '3rem',
        paddingTop: '1.5rem',
        borderTop: `1px solid ${theme.palette.border.primary.primary400}`,
        color: theme.palette.text.primary.primary300,
        fontSize: '0.875rem',
    },
}));

const Footer: React.FC = () => {
    const classes = useStyles();
    const currentYear = new Date().getFullYear();

    return (
        <footer className={classes.footer}>
            <div className={classes.container}>
                <div className={classes.section}>
                    <h3 className={classes.title}>About</h3>
                    <p style={{ marginBottom: '1rem' }}>
                        A passionate developer building amazing web experiences with modern technologies.
                    </p>
                    <div className={classes.socialLinks}>
                        <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer" className={classes.socialLink}>
                            <FaGithub />
                        </a>
                        <a href="https://linkedin.com/in/yourusername" target="_blank" rel="noopener noreferrer" className={classes.socialLink}>
                            <FaLinkedin />
                        </a>
                        <a href="https://twitter.com/yourusername" target="_blank" rel="noopener noreferrer" className={classes.socialLink}>
                            <FaTwitter />
                        </a>
                        <a href="mailto:your.email@example.com" className={classes.socialLink}>
                            <FaEnvelope />
                        </a>
                    </div>
                </div>

                <div className={classes.section}>
                    <h3 className={classes.title}>Quick Links</h3>
                    <RouterLink to="/" className={classes.link}>
                        Home
                    </RouterLink>
                    <RouterLink to="/projects" className={classes.link}>
                        Projects
                    </RouterLink>
                    <RouterLink to="/skills" className={classes.link}>
                        Skills
                    </RouterLink>
                    <RouterLink to="/about" className={classes.link}>
                        About
                    </RouterLink>
                    <RouterLink to="/contact" className={classes.link}>
                        Contact
                    </RouterLink>
                </div>

                <div className={classes.section}>
                    <h3 className={classes.title}>Contact</h3>
                    <p style={{ marginBottom: '1rem' }}>
                        Have a project in mind or want to chat? Feel free to reach out!
                    </p>
                    <a href="mailto:your.email@example.com" className={classes.link}>
                        your.email@example.com
                    </a>
                </div>
            </div>

            <div className={classes.copyright}>
                &copy; {currentYear} Your Name. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
