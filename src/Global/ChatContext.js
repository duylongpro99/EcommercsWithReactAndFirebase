import React, { createContext } from 'react'
import { auth, db , adminId} from '../Config/Config'

export const ChatContext = createContext();

export class ChatContextProvider extends React.Component {
    state = {
        conversation: [],
        unReadMessageCount: 0,
        listMessageUnRead: [],
        userId: '',
    }
    getData(){
        let conversationPrev = [];
        let unRead = 0;
        let listMessageUnRead = [];
        db.collection('ChatHub').orderBy("from").onSnapshot(snapshot => {
            let changes = snapshot.docChanges();
            changes.forEach(change => {
                if (change.type === 'added') {
                     
                    if(change.doc.data().userId !==  adminId){
                        db.collection('SignedUpUsersData').doc(change.doc.data().userId)
                        .get().then((doc) => {
                            conversationPrev = [{
                                messageId: change.doc.id,
                                isAdmin: change.doc.data().isAdmin  ,
                                content: change.doc.data().content,
                                userId: change.doc.data().userId,
                                avatar: doc.data().avatar,
                                from: change.doc.data().from,
                                isRead: change.doc.data().isRead,
                                formName: doc.data().Name,
                                toUserId: change.doc.data().toUserId
                            },...conversationPrev];
                            if(!change.doc.data().isRead &&  change.doc.data().userId !== this.state.userId){
                                unRead += 1;
                                listMessageUnRead = [
                                    {
                                        messageId: change.doc.id,
                                        isAdmin: change.doc.data().isAdmin,
                                        content:  change.doc.data().content,
                                        userId: change.doc.data().userId,
                                        avatar: doc.data().avatar,
                                        from: change.doc.data().from,
                                        isRead: change.doc.data().isRead,
                                        formName: doc.data().Name,
                                        toUserId: change.doc.data().toUserId
                                    },...listMessageUnRead
                                ];
                            }
                            this.setState({
                                conversation: conversationPrev,
                                unReadMessageCount: unRead,
                                listMessageUnRead: listMessageUnRead
                            })
                        })
                    }
                    else{
                        conversationPrev = [{
                            messageId: change.doc.id,
                            isAdmin: change.doc.data().isAdmin,
                            content: change.doc.data().content,
                            userId: adminId,
                            avatar: change.doc.data().avatar,
                            from: change.doc.data().from,
                            isRead: change.doc.data().isRead,
                            formName: 'Admin',
                            toUserId: change.doc.data().toUserId
                        },...conversationPrev];
                        if(!change.doc.data().isRead  && change.doc.data().userId !== adminId){
                            unRead += 1;
                            listMessageUnRead = [
                                {
                                    messageId: change.doc.id,
                                    isAdmin: change.doc.data().isAdmin,
                                    content: change.doc.data().content,
                                    userId: adminId,
                                    avatar: change.doc.data().avatar,
                                    from: change.doc.data().from,
                                    isRead: change.doc.data().isRead,
                                    formName: 'Admin',
                                    toUserId: change.doc.data().toUserId
                                },...listMessageUnRead
                            ];
                        }
                        this.setState({
                            conversation: conversationPrev,
                            unReadMessageCount: unRead,
                            listMessageUnRead: listMessageUnRead
                        })
                    }
                }
            });
        });
    }
    componentDidMount() {

        this.getData = this.getData.bind(this);
        
        // getting user info for navigation bar
        auth.onAuthStateChanged(user => {
            if (user) {
                db.collection('SignedUpUsersData').doc(user.uid).get().then(snapshot => {
                    this.setState({
                        userId: user.uid,
                        isAdmin: snapshot.data().IsAdmin ? true : false 
                    }, ()=>{
                    })
                })
            }
            else {
                this.setState({
                    user: null
                })
            }
        })
        
        this.getData();
        
    }


    render() {
        return (
            <ChatContext.Provider  value={{ conversation: [...this.state.conversation], 
                    unRead: this.state.unReadMessageCount,
                    listMessageUnRead: this.state.listMessageUnRead,
                    getData: this.getData
            }}>
                {this.props.children}
            </ChatContext.Provider>
        )
    }
}

