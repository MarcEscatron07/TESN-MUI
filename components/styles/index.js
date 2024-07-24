export const CARD_POST = {
    cardPostContainer: {
        height: 'auto',
        width: 700,
        my: 2
    },
    cardPostImagePlaceholder: {
        height: '100%',
        width: 700
    },
    cardPostActions: {
        display: 'flex',
        justifyContent: 'space-between'
    }
}

export const CHAT_BOX = {
    chatBoxPaperContainer: {
        height: '100%'
    },
    chatBoxCardContainer: {
        height: '100%'
    },
    chatBoxCardHeader: {
        height: '12%',
        display: 'flex',
        alignItems: 'center',
        padding: 1,
        "& .MuiCardHeader-avatar": {
            height: 40,
            display: 'flex',
            alignItems: 'center',
        },
        "& .MuiCardHeader-content": {
            height: 40,
            display: 'flex',
            alignItems: 'center',
        },
        "& .MuiCardHeader-action": {
            height: 48,
            display: 'flex',
            alignItems: 'center',
        }
    },
    chatBoxCardHeaderTitle: {
        fontWeight: 'bold',
        fontSize: '.95rem'
    },
    chatBoxCardContent: {
        height: '76%',
        overflowX: 'hidden',
        overflowY: 'auto',
        px: 2,
    },
    chatBoxCardContentBox: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    chatBoxCardActions: {
        height: '12%',
        display: 'flex',
        justifyContent: 'space-between'
    },
    chatBoxCardActionsBox: {
        display: 'flex',
        alignItems: 'center'
    },
    chatBoxCardActionsBoxInput: {
        p: 1,
        overflow: 'hidden',
        borderRadius: '0px 0px 0px 4px'
    },
    chatBoxCardActionsBoxButton: {
        borderRadius: '0px 4px 4px 0px'
    }
}

export const CHAT_LIST = {
    chatListFabNewChat: {
        height: 55,
        width: 55,
        my: 1
    },
    chatListFabAvatar: {
        position: 'relative',
        my: 1.2
    },
    chatListFabClose: {
        position: 'absolute', 
        top: -5, 
        right: 0, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        padding: '2px 4px', 
        borderRadius: 50
    },
}

export const LEFT_DRAWER = {
    leftDrawerHeader: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    leftDrawerHeaderPaper: {
        width: "85%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 4,
        borderRadius: '10px 50px 20px 50px',
    },
    leftDrawerSitename: {
        marginLeft: 15
    },
    leftDrawerList: {
        fontWeight: 'bold',
        textTransform: 'uppercase'
    },
    leftDrawerListItem: {
        display: "block",
    },
    leftDrawerListItemButton: {
        minHeight: 48,
        px: 2.5,
    },
    leftDrawerListItemIcon: {
        minWidth: 0,
        justifyContent: "center",
    }
}

export const RIGHT_DRAWER = {
    rightDrawerHeader: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    rightDrawerList: {
        fontWeight: 'bold',
        textTransform: 'uppercase'
    },
    rightDrawerListItem: {
        display: "block",
    },
    rightDrawerListItemButton: {
        minHeight: 48,
        px: 2.5,
        justifyContent: "initial"
    },
    rightDrawerListItemIcon: {
        minWidth: 0,
        mr: 3,
        justifyContent: "center",
    }
}

export const TOP_APP_BAR = {
    topAppBarLeftDrawerToggle: {
        marginRight: 5
    },
    topAppBarSearch: {
        marginLeft: 15
    },
    topAppBarSearchInput: {
        width: "400px"
    },
    topAppBarNotifications: {
        display: { 
            xs: "none", 
            md: "flex" 
        }
    },
    topAppBarNotificationButtons: {
        marginLeft: 1
    },
    topAppBarAvatar: {
        marginLeft: 5, 
        marginRight: 1
    },
    topAppBarAvatarChip: {
        px: 2, 
        minWidth: 100, 
        fontSize: '.95rem',
        fontWeight: 'bold', 
    },
    topAppBarMobileMenuToggle: {
        display: { 
            xs: "flex", 
            md: "none" 
        }
    }
}