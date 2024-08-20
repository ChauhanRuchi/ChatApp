
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway(3002, {
  cors: {
    origin: 'http://localhost:3001',
    methods: ['GET', 'POST'],
    allowedHeaders: ['content-type'],
    credentials: true,
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private onlineUsers: { user_id: string; socketId: string }[] = [];
  private typingUsers=[]

  handleConnection(socket: Socket) {

    // add message
    socket.on('sendMessage', (message) => {
      
      const user = this.onlineUsers.find(user => user.user_id === message.recipientId);

      if (user) {
        this.server.to(user.socketId).emit('getMessage', message);
        this.server.to(user.socketId).emit('getNotification', {
          message_id:message?.message_id,
          sender_id: message?.sender_id,
          isRead: false,
          date: new Date
        });

      }

    });
   

    socket.on("chatOpened", (res) => {
      console.log("chatisopenss", res)
    })
  }

  handleDisconnect(socket: Socket) {
    this.onlineUsers = this.onlineUsers.filter(
      (user) => user.socketId !== socket.id,
    );
    this.server.emit('getOnlineUsers', this.onlineUsers);
  }

  @SubscribeMessage('addNewUser')
  handleAddNewUser(socket: Socket, user_id: string) {
    if (!this.onlineUsers.some((user) => user.user_id === user_id)&&user_id!=null) {
      console.log('after', this.onlineUsers);

      this.onlineUsers.push({
        user_id,
        socketId: socket.id,
      });
    }

    this.server.emit('getOnlineUsers', this.onlineUsers);
  }

  @SubscribeMessage('updateChat')
  handleNewMessage(@MessageBody() message: string): void {
    this.server.emit('updateChatList', message);
  }
  // @SubscribeMessage('clientStatus')
  // handleClientStatus(client: Socket, status: string) {
  //   console.log(`Client `,client?.id,this.onlineUsers);
  //   this.server.emit('userStatus', { id: client.id, status });
  // }

  @SubscribeMessage('chatOpened')
  handleChatOpened(client: Socket, payload: any): void {
    this.server.emit('chatOpened1', payload);
  }


  @SubscribeMessage('typing')
  handleTyping(client: Socket, typing: boolean, sender_id: string, chat_id: string) {
    console.log("user typing typing.....",typing,sender_id,chat_id)

    const index = this.typingUsers?.findIndex(indicator => indicator?.sender_id === sender_id && indicator.chat_id === chat_id);
    if (index !== -1) {
      this.typingUsers[index].typing = typing;
    } else {
      this.typingUsers.push({ sender_id:sender_id, typing:typing, chat_id:chat_id });
    }
    console.log("user are typing.....",this.typingUsers)
    this.server.emit('userTyping', this.typingUsers);
  }

}
