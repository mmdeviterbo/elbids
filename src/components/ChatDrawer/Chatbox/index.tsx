import { ReactElement, useState, useEffect, Fragment } from 'react';
import {
  MainContainer, ChatContainer, ConversationHeader,
  MessageList, Message, MessageInput,
  Avatar, InfoButton,
  Conversation, ConversationList
} from "@chatscope/chat-ui-kit-react";

import { ConversationType, FindManyConversationArgs, MessageType, UserDisplay, InsertOneConversationArgs, InsertOneMessageArgs, STATUS } from '../../../types'
import { ObjectId } from 'bson';
import { useQuery, useMutation, useLazyQuery } from '@apollo/client';
import { conversationsQuery, messagesQuery, userQuery } from './query'
import { insertOneConversationMutation, insertOneMessageMutation } from './mutation'
import VerifiedUserIcon from '@material-ui/icons/CheckCircle';
import WaitingUserIcon from '@material-ui/icons/Autorenew';
import { green } from '@material-ui/core/colors';
import useStyles from './style'
import ReportDialog from './ReportDialog';

const Chatbox=({
    isCreate=false,
    isRead=false,
    user,
    other=null,
  }:{
    isCreate?: boolean
    isRead?: boolean
    user: UserDisplay      //who the buyer
    other?: UserDisplay 
  }
): ReactElement=>{
  const classes = useStyles()
  const imageUrlDefault: string = 'https://t3.ftcdn.net/jpg/03/46/83/96/360_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg'

  const [chatMessage, setChatMessage]=useState<string>('')
  const [activeConversation, setActiveConversation]=useState<ConversationType>(null)
  const [conversations, setConversations]=useState<ConversationType[]>()
  const [messages, setMessages]=useState<MessageType[]>()
  
  const [openReport, setOpenReport] = useState<boolean>(false)

  const [insertConversationMutation, {loading}] = useMutation(insertOneConversationMutation,{
    notifyOnNetworkStatusChange: true
  })

  useEffect(()=>{
    if(isRead && !isCreate && !activeConversation && conversations?.length>0){
      setActiveConversation(conversations[0])
    }
  },[isCreate, isRead, activeConversation, conversations])


  const findManyConversationsState = useQuery(conversationsQuery,{
    skip: !user?._id,
    variables: { user_ids: [new ObjectId(user?._id)] },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy:'cache-first',
    pollInterval: 500,
    onCompleted:async(e): Promise<void>=>{
      let tempManyConversations: ConversationType[] = e?.findManyConversations
      if(tempManyConversations?.length>0){
        setConversations([...tempManyConversations].reverse())
      }
      if(!activeConversation){
        if(isCreate && !isRead){
          let tempActiveConversation: ConversationType = tempManyConversations?.find((convo: ConversationType)=>convo?.user_ids?.includes(other?._id))
          if(!tempActiveConversation){
            let newConversationId: ObjectId = new ObjectId()
            let insertConversationArgs: InsertOneConversationArgs = {
              _id: activeConversation?._id || newConversationId,
              user_ids: [new ObjectId(user?._id), new ObjectId(other?._id)],
            }
            findManyConversationsState.stopPolling()
            await insertConversationMutation({ variables: { ...insertConversationArgs } })
            findManyConversationsState.startPolling(500)
          }else setActiveConversation(tempActiveConversation)
        }
      }
    }
  })

  const findManyMessagesState = useQuery(messagesQuery,{
    skip: !activeConversation?._id?.toString(),
    variables: { conversation_id: new ObjectId(activeConversation?._id) },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-first',
    pollInterval: 500,
    onCompleted:(e)=>{
      setMessages(e?.findManyMessages)
    }
  })
  
  useEffect(()=>{
    findManyMessagesState.refetch({ conversation_id: activeConversation?._id })
    findManyMessagesState.stopPolling()
    findManyMessagesState.refetch({ conversation_id: new ObjectId(activeConversation?._id) })
    findManyMessagesState.startPolling(500)
  },[activeConversation])

  const [insertMessageMutation] = useMutation(insertOneMessageMutation,{
    notifyOnNetworkStatusChange: true
  })

  let formatStatusIcon=(tempUser: UserDisplay): ReactElement =>{
    return(
      <div style={{display:'flex', justifyContent:'flex-start', alignItems:'center'}}>
        {tempUser?.status===STATUS.VERIFIED && <VerifiedUserIcon fontSize={'small'} style={{ color: green[500] }}/>}
        {tempUser?.status===STATUS.WAITING && <WaitingUserIcon fontSize={'small'} color={'primary'}/>}
        &nbsp;
        {tempUser?.status?.charAt(0).toUpperCase()+tempUser?.status?.slice(1).toLowerCase()}
      </div>
    )
  }

  const handleChatConversation=async(): Promise<void>=>{
    let insertMessageArgs: InsertOneMessageArgs = {
      conversation_id: activeConversation?._id,
      user_id: new ObjectId(user?._id),
      message: chatMessage
    }

    await insertMessageMutation({
      variables: { ...insertMessageArgs }
    })
  }

  const getOtherUser=(tempConversation: Conversation): UserDisplay =>{
    let users = tempConversation?.users
    if(users){
      return users[0]._id!==user?._id? users[0] : users[1]
    }
    return null
  }

  const getMeUser=(tempConversation: Conversation): UserDisplay =>{
    let users = tempConversation?.users
    if(users){
      return users[0]._id===user?._id? users[0] : users[1]
    }
    return null
  }

  return(
    <div className={classes.root}>
      <MainContainer>

      {/* CHAT CONVERSATIONS LIST */}
      <ConversationList>
        <Conversation
          style={{backgroundColor:'#F6FBFF', borderBottom:'1px solid rgba(192,192,192,0.8)', margin:0}}
          name={<span style={{"textTransform":'capitalize'}}><strong>{user?.full_name}</strong></span>}
          info={formatStatusIcon(user)}
        >
          <Avatar src={user?.imageUrl} name="Lilly" />
        </Conversation>

        {conversations?.map((conversation: ConversationType, index: number)=>{
          let userOther: UserDisplay = conversation?.users[0]?._id !== user?._id? conversation?.users[0] : conversation?.users[1]
          return(
            <Fragment key={index}>
              {userOther && <Conversation
                name={<span style={{"textTransform":'capitalize'}}>{userOther?.full_name}</span>}
                info=""
                onClick={()=>setActiveConversation(conversation)}
                active={conversation?._id === activeConversation?._id? true : false}
              >
                <Avatar
                  src={getOtherUser(conversation)?.imageUrl || imageUrlDefault}
                  name={getOtherUser(conversation)?.full_name} />
              </Conversation>}
            </Fragment>
          )})
        }
      </ConversationList>

        {/* CHAT MESSAGES */}
        <ChatContainer>       
          {activeConversation &&
            <ConversationHeader>
              <Avatar src={getOtherUser(activeConversation)?.imageUrl || imageUrlDefault}/>
              <ConversationHeader.Content 
                userName={<span style={{"textTransform":'capitalize'}}>{getOtherUser(activeConversation)?.full_name}</span>}
                info={formatStatusIcon(getOtherUser(activeConversation))}/>
              <ConversationHeader.Actions>                                                                             
                <InfoButton title="Report account" onClick={()=>setOpenReport(true)}/>
              </ConversationHeader.Actions>
          </ConversationHeader>
          }
          <MessageList>
            {messages?.map((message: MessageType, index: number): ReactElement =>{
              return(
                <Fragment key={index}>
                  {message?.user?._id && 
                    <Message 
                      model={{
                        message: message?.message,
                        sender: message?.user?.full_name,
                        direction: message?.user?._id===user?._id? "outgoing" : "incoming",
                        position:"single"
                      }}
                    >
                      {message?.user?._id!==user?._id 
                        && 
                        <Avatar 
                          src={message?.user?.imageUrl || imageUrlDefault}
                          name={message?.user?.full_name}
                        />
                      }
                    </Message>}
                </Fragment>
              )})
            }
          </MessageList>
          {activeConversation && <MessageInput 
            onSend={()=>handleChatConversation()}
            attachButton={false}
            placeholder="Type message here"
            onChange={(str)=>setChatMessage(str)}
          />}
        </ChatContainer>
      </MainContainer>
      <ReportDialog 
        user_id={new ObjectId(getOtherUser(activeConversation)?._id)}
        openReport={openReport}
        setOpenReport={setOpenReport}
        />
    </div>
  )
}
export default Chatbox

// Documentation of this chat UI: https://chatscope.io/storybook/react/?path=/docs/components-conversationlist--default-story
// Demo: https://demo.chatscope.io/chat