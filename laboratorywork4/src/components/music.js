import React, { Component } from 'react'

class musicPlayer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            play: false,
            pause: true,
        }
        this.songs = [
            "/music/danza.mp3",
            "/music/99.mp3",
            "/music/toxic.mp3"
        ];
        const randomIndex = Math.floor(Math.random() * this.songs.length);
        this.url = this.songs[randomIndex];
        this.audio = new Audio(this.url);
    }

    toogle = () => { 
        if (this.state.play === false) {
            this.setState({ play: true, pause: false })
            this.audio.play();
        } else{
            this.setState({ play: false, pause: true })
            this.audio.pause();
        }
    }

    render() {
        return (
            <div>
                <button className="music" onClick={this.toogle}>{this.state.play ? <div>Pause Music</div> : <div>Play Music</div>}</button>
            </div>
        );
    }
}

export default musicPlayer;
