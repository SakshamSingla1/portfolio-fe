import React from 'react';
import { Box, Container, Typography, Grid, Link, Avatar, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';

interface HomeTemplateProps {
    formik: any; // Formik form instance from the parent
    isSubmitting: boolean;
    handleSubmit: (e?: React.FormEvent<HTMLFormElement> | undefined) => void;
}

const StyledAvatar = styled(Avatar)(({ theme }) => ({
    width: 250,
    height: 250,
    margin: '0 auto',
    marginBottom: theme.spacing(4),
    border: `4px solid ${theme.palette.primary.main}`,
    [theme.breakpoints.down('sm')]: {
        width: 200,
        height: 200,
    },
}));

const Section = styled(Box)(({ theme }) => ({
    padding: theme.spacing(8, 0),
    '&:nth-of-type(even)': {
        backgroundColor: theme.palette.background.paper,
    },
    [theme.breakpoints.down('md')]: {
        padding: theme.spacing(6, 0),
    },
}));

const HomeTemplate: React.FC<HomeTemplateProps> = ({ formik, isSubmitting, handleSubmit }) => {
    const { values } = formik;
    const theme = useTheme();

    return (
        <Box component="main">
            {/* Hero Section */}
            <Section>
                <Container maxWidth="md">
                    <Box textAlign="center">
                        <StyledAvatar
                            alt={values.fullName || 'Profile Picture'}
                            src="/profile.jpg"
                            sx={{
                                background: theme.palette.grey[200],
                                color: theme.palette.text.secondary,
                            }}
                        >
                            {values.fullName ? values.fullName.charAt(0) : 'U'}
                        </StyledAvatar>
                        <Typography
                            variant="h2"
                            component="h1"
                            gutterBottom
                            sx={{
                                fontWeight: 700,
                                [theme.breakpoints.down('sm')]: {
                                    fontSize: '2.5rem',
                                },
                            }}
                        >
                            {values.fullName || 'Your Name'}
                        </Typography>
                        <Typography
                            variant="h4"
                            color="primary"
                            gutterBottom
                            sx={{
                                [theme.breakpoints.down('sm')]: {
                                    fontSize: '1.5rem',
                                },
                            }}
                        >
                            {values.title || 'Your Professional Title'}
                        </Typography>
                        <Typography variant="h6" color="textSecondary" paragraph>
                            {values.location || 'Your Location'}
                        </Typography>
                    </Box>
                </Container>
            </Section>

            {/* About Me Section */}
            <Section>
                <Container maxWidth="md">
                    <Typography
                        variant="h3"
                        component="h2"
                        gutterBottom
                        align="center"
                        sx={{
                            [theme.breakpoints.down('sm')]: {
                                fontSize: '2rem',
                            },
                        }}
                    >
                        About Me
                    </Typography>
                    <Typography
                        variant="body1"
                        paragraph
                        align="center"
                        sx={{
                            fontSize: '1.1rem',
                            lineHeight: 1.8,
                            maxWidth: '800px',
                            margin: '0 auto',
                        }}
                    >
                        {values.aboutMe || 'Tell something about yourself...'}
                    </Typography>
                </Container>
            </Section>

            {/* Contact Section */}
            <Section>
                <Container maxWidth="md">
                    <Typography
                        variant="h3"
                        component="h2"
                        gutterBottom
                        align="center"
                        sx={{
                            [theme.breakpoints.down('sm')]: {
                                fontSize: '2rem',
                            },
                        }}
                    >
                        Get In Touch
                    </Typography>
                    <Grid
                        container
                        spacing={4}
                        justifyContent="center"
                        sx={{ marginBottom: theme.spacing(4) }}
                    >
                        <Grid item xs={12} md={4} textAlign="center">
                            <Typography variant="h6" gutterBottom>Email</Typography>
                            <Link
                                href={`mailto:${values.email || '#'}`}
                                color="inherit"
                                sx={{
                                    display: 'inline-block',
                                    '&:hover': {
                                        color: theme.palette.primary.main,
                                    },
                                }}
                            >
                                {values.email || 'your.email@example.com'}
                            </Link>
                        </Grid>
                        {values.phone && (
                            <Grid item xs={12} md={4} textAlign="center">
                                <Typography variant="h6" gutterBottom>Phone</Typography>
                                <Link
                                    href={`tel:${values.phone}`}
                                    color="inherit"
                                    sx={{
                                        display: 'inline-block',
                                        '&:hover': {
                                            color: theme.palette.primary.main,
                                        },
                                    }}
                                >
                                    {values.phone}
                                </Link>
                            </Grid>
                        )}
                    </Grid>

                    <Box mt={6} textAlign="center">
                        <Typography
                            variant="h6"
                            gutterBottom
                            sx={{ marginBottom: theme.spacing(3) }}
                        >
                            Connect with me
                        </Typography>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                gap: 3,
                                '& a': {
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-3px)',
                                        color: theme.palette.primary.main,
                                    },
                                },
                            }}
                        >
                            {values.githubUrl && (
                                <Link
                                    href={values.githubUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    underline="none"
                                >
                                    GitHub
                                </Link>
                            )}
                            {values.linkedinUrl && (
                                <Link
                                    href={values.linkedinUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    underline="none"
                                >
                                    LinkedIn
                                </Link>
                            )}
                            {values.websiteUrl && (
                                <Link
                                    href={values.websiteUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    underline="none"
                                >
                                    Website
                                </Link>
                            )}
                        </Box>
                    </Box>
                </Container>
            </Section>
        </Box>
    );
};

export default HomeTemplate;