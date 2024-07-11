export const GLOBAL = {
    globalMainContainer: {
        position: 'relative',
        display: 'flex'
    }
}

export const LOGIN = {
    loginMainContainer: {
        height: "100vh"
    },
    loginSectionLeft: {
        py: 8,
        px: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
    },
    loginSectionRight: {
        backgroundImage: 'url("/images/tagbilaran-city-hall.png")',
        backgroundSize: "cover",
        backgroundPosition: "left",
    },
    loginHeaderContainer: { 
        width: '75%',
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        borderRadius: '10px 50px 20px 50px',
        backgroundColor: '#FBD11A',
        padding: 15
    },
    loginHeaderText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 15, 
    },
    loginFormContainer: {
        maxWidth: '75%',
        paddingTop: 20,
        paddingRight: 30,
        paddingBottom: 20,
        paddingLeft: 30,
        borderRadius: '10px 50px 20px 50px',
        backgroundColor: '#699B7E'
    },
    loginFormInputProps: {
        backgroundColor: '#FFFFFF'
    },
    loginFormInputLabelProps: {
        top: '-2px', 
        left: '-4px', 
        fontWeight: 'bold', 
        padding: '2px 4px', 
        borderRadius: 5, 
        border: '3px solid #00703C', 
        backgroundColor: '#FFFFFF' 
    },
    loginFormControlLabel: {
        color: '#FFFFFF'
    },
    loginFormButtonSignIn: {
        mt: 4, 
        mb: 2
    },
    loginFormForgotPassword: { 
        display: 'flex', 
        justifyContent: 'flex-end' 
    },
    loginFormCopyright: {
        mt: 10
    }
}

export const HOME = {
    homeSectionContent: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        flexGrow: 1, 
        p: 3
    },
}