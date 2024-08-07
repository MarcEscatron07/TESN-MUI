export const CARD_POST = {
    cardPostContainer: {
        height: 'auto',
        my: 2
    },
    cardPostImagePlaceholder: {
        height: '100%',
        width: '100%'
    },
    cardPostActions: {
        display: 'flex',
        justifyContent: 'space-between'
    },
    cardPostCollapseContent: {
        px: 3
    }
}

export const CHAT_BOX = {
    chatBoxPaperContainer: {
        position: 'relative',
        height: '100%'
    },
    chatBoxCardContainer: {
        height: '100%',
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
        position: 'relative',
        height: '76%',
        overflowX: 'hidden',
        overflowY: 'auto',
        px: 1,
    },
    chatBoxCardLoaderBox: {
        position: 'absolute',
        top: 0,
        left: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        width: '100%',
    },
    chatBoxCardContentSystemBox: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        mt: 1, 
        mb: 4
    },
    chatBoxCardContentSystemBoxText: {
        fontWeight: 'bold'
    },
    chatBoxCardContentDefaultBox: {
        width: '100%',
        display: 'flex',
        my: 2
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
    chatBoxCardActionsBoxInputWrapper: {
        position: 'relative', 
        width: '100%'
    },
    chatBoxCardActionsBoxInput: {
        p: 1,
        overflow: 'hidden',
        borderRadius: '0px 0px 0px 4px'
    },
    chatBoxCardActionsBoxButton: {
        height: 'auto',
        maxWidth: '40px',  
        minWidth: '40px',
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
        right: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2px 4px',
        borderRadius: 50
    },
    chatListOption: {
        mb: .5
    },
    chatListPopoverBox: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    chatListPopoverOptionClose: {
        width: '100%',
        display: 'flex',
        justifyContent: 'flex-start',
    },
    chatListPopoverOptionMinimize: {
        width: '100%',
        display: 'flex',
        justifyContent: 'flex-start',
    }
}

export const EVENT_CALENDAR = {
    eventCalendarPaperContainer: {
        p: 3
    },
    eventCalendarPopoverBox: {
        height: '100%'
    },
    eventCalendarPopoverTitle: {
        width: '100%',
        px: 1,
        py: .8,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    eventCalendarPopoverItem: {
        width: '100%',
        px: 1,
        py: .8,
    },
    eventCalendarPopoverItemTextContainer: {
        display: 'flex', 
        alignItems: 'center'
    },
    eventCalendarPopoverItemIcon: {
        color: 'gray'
    },
    eventCalendarPopoverItemText: {
        marginLeft: 15
    },
    eventCalendarModalGrid: {
        p: 1
    },
    eventCalendarModalDateTimePicker: {
        width: '100%'
    },
    eventCalendarModalOptionAvatar: {
        mr: 1
    }
}

export const LEFT_DRAWER = {
    leftDrawerContainer: {
        height: '100vh',
    },
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
    leftDrawerBoxToggle: {
        width: "15%"
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
    rightDrawerContainer: {
        height: '100vh',
    },
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
    },
    rightDrawerListItemIcon: {
        minWidth: 0,
        justifyContent: "center",
    }
}

export const TOP_APP_BAR = {
    topAppBarLeftDrawerToggle: {
        marginRight: '5px !important'
    },
    topAppBarSpacer: {
        flexGrow: 1
    },
    topAppBarToolbar: {
        px: '5px'
    },
    topAppBarSearch: {
        marginLeft: '15px !important'
    },
    topAppBarSearchInput: {
        width: "auto"
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