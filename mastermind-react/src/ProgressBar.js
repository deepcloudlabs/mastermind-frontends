import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

class ProgressBar extends Component {
    render() {
        return (
            <div className="progress">
                <div ref={ (btn) => {this.btn = btn;} }
                     aria-valuenow="0"
                     aria-valuemin="0"
                     aria-valuemax="16"
                     style={this.props.progressCounter}
                     className={this.props.progressColor}>
                </div>
            </div>
        )
    }
}

export default ProgressBar;
