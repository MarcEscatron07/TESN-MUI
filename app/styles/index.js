export const LOGIN = {
    mainContainer: {
        height: "100vh"
    },
    sectionLeft: {
        py: 8,
        px: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
    },
    sectionRight: {
        backgroundImage: 'url("/images/tagbilaran-city-hall.png")',
        backgroundSize: "cover",
        backgroundPosition: "left",
    },
    headerContainer: { 
        width: '75%',
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        borderRadius: '10px 50px 20px 50px',
        backgroundColor: '#FBD11A',
        padding: 15
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 15, 
    },
    formContainer: {
        maxWidth: '75%',
        paddingTop: 20,
        paddingRight: 30,
        paddingBottom: 20,
        paddingLeft: 30,
        borderRadius: '10px 50px 20px 50px',
        backgroundColor: '#699B7E'
    },
    formInputProps: {
        backgroundColor: '#FFFFFF'
    },
    formInputLabelProps: {
        top: '-2px', 
        left: '-4px', 
        fontWeight: 'bold', 
        padding: '2px 4px', 
        borderRadius: 5, 
        border: '3px solid #00703C', 
        backgroundColor: '#FFFFFF' 
    },
    formControlLabel: {
        color: '#FFFFFF'
    },
    formButtonSignIn: {
        mt: 4, 
        mb: 2
    },
    formForgotPassword: { 
        display: 'flex', 
        justifyContent: 'flex-end' 
    },
    formCopyright: {
        mt: 10
    }
}

export const HOME = {
    mainContainer: {
        position: 'relative',
        display: 'flex'
    },
    sectionContent: {
        flexGrow: 1, 
        p: 3
    },
}