import React from 'react'

import {Message} from 'chatbits'
import 'chatbits/dist/index.css'


const App = () => {
	return (
		<div>
			<Message
				delete={() => {}}
                streamerInfo={{DisplayPlatformColors: true, TwitchColor: "#242c48", ShowNameColors: true }}
                in={true}
				msg={{
					body: "test",
					avatar:
						"https://static-cdn.jtvnw.net/jtv_user_pictures/9e40522b-dca4-4e2e-9aa0-ccfa6550e208-profile_image-70x70.png",
					displayName: "david",
                    platform: "twitch",
                    sentAt: 1590536099323,
                    badges: {},
                    userColor: "#d2691e"
				}}
			/>
			<Message
				delete={() => {}}
                streamerInfo={{ DisplayPlatformColors: true, DisplayPlatformIcons: false, TwitchColor: "#ffffff", CompactMessages: true }}
                in={true}
                msg={{
                    body: 'This is a smaller version of the chat so you can fit more messages on the screen. this is a longer message that someone sent because they have something long to say and it gets wrapped fuck onto the next line https://www.twitch.tv/dav1dsnyder404',
					avatar:
						"https://static-cdn.jtvnw.net/jtv_user_pictures/9e40522b-dca4-4e2e-9aa0-ccfa6550e208-profile_image-70x70.png",
                    displayName: "david",
                    platform: "twitch",
                    sentAt: 1590536099323,
                    badges: {},
                    userColor: "#d2691e"
				}}
			/>
		</div>
	)
}

export default App
