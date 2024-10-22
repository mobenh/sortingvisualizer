// App.js
import React, { Component, useState, useEffect } from 'react';
import { FormControl, FormControlLabel, Radio, RadioGroup, FormLabel } from '@material-ui/core';

// Algorithms
import BubbleSort from './algorithms/BubbleSort';
import MergeSort from './algorithms/MergeSort';
import QuickSort from './algorithms/QuickSort';
import InsertionSort from './algorithms/InsertionSort';
import SelectionSort from './algorithms/SelectionSort';

// Icons
import Play from '@material-ui/icons/PlayCircleOutlineRounded';
import Forward from '@material-ui/icons/SkipNextRounded';
import Backward from '@material-ui/icons/SkipPreviousRounded';
import RotateLeft from '@material-ui/icons/RotateLeft';

// Styles
import './App.css';

// Function to implement riseText effect
const riseText = (e) => {
	const cssCode = `
    body {
      background: #ffffff;
      margin: 70px;
    }

    .risetext {
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      color: rgb(21, 95, 46);
      left: 25%;
      font: 800 3em 'Montserrat', 'Helvetica Neue', sans-serif;
      text-transform: uppercase;
      margin-top: 20px;
      margin-bottom: 0px;
      width: 100%;
    }

    @media only screen and (max-width: 1050px) {
      body {
        background: #ffffff;
        max-height: 100%;
        display: flex;
        align-items: center;
      }
    }
  `;

	// Inject the CSS into the document
	const styleElement = document.createElement('style');
	styleElement.type = 'text/css';
	styleElement.appendChild(document.createTextNode(cssCode));
	document.head.appendChild(styleElement);

	// Your existing JavaScript code
	const risetext = document.querySelector('.risetext');
	console.log(risetext);
	const enclose = document.querySelector('.page-header_title-main');
	console.log(enclose);
	const encloseText = Array.from(enclose.innerText.split(''));
	console.log(encloseText);
	let string = encloseText
		.map((x) => {
			if (x === ' ') {
				return `<span class="letter">&nbsp;</span></span><span class="word">`;
			} else {
				return `<span class="letter">${x}</span>`;
			}
		})
		.join('');

	console.log(string);

	string = string.replace(
		'<span class="letter"> </span>',
		'<span class="letter">&nbsp;</span>'
	);
	enclose.innerHTML = `<span class="word">${string}</span>`;

	const letters = Array.from(document.querySelectorAll('.letter'));

	function timeout() {
		setTimeout(function () {
			risetext.classList.toggle('show');
		}, 500);
	}

	timeout();

	letters.forEach(function (letter, i) {
		const style = `transition-delay: ${50 * i}ms;`;
		letter.setAttribute('style', `${style}`);
	});
};

// Include the Form component here
function Form({	formLabel, values, labels, currentValue, onChange }) {
	return (
		<div className='container-small'>
			<FormControl>
				<div className='labels'>
					<FormLabel>{formLabel}</FormLabel>
				</div>
				<RadioGroup value={currentValue} onChange={onChange}>
					{values.map((value, index) => {
						return (
							<FormControlLabel
								key={`${value}_${index}`}
								value={value}
								control={<Radio />}
								label={labels[index]}
							/>
						);
					})}
				</RadioGroup>
			</FormControl>
		</div>
	);
}

// Define the Bar component within App.js
const Bar = ({ index, length, color, changeArray }) => {
	const [len, setLength] = useState(length);

	useEffect(() => {
		setLength(length);
	}, [length]);

	const colors = ['#00FFFF', '#e77878', '#83e85a'];

	const barStyle = {
		borderRadius: '5px 5px 0 0',
		width: '25px',
		marginLeft: '5px',
		marginRight: '5px',
		background: colors[color],
		height: len,
		marginTop: 200 - len,
		position: 'relative',
	};

	const textStyle = {
		textAlign: 'center',
		transform: 'rotate(-90deg)',
		fontFamily: 'mono',
		outline: 'none',
		position: 'relative',
		top: Math.floor(len / 2) - 10,
		width: len,
		left: -Math.floor(len / 2) + 11,
		background: 'transparent',
		border: 'none',
		WebkitAppearance: 'none', // For Chrome and Safari
		MozAppearance: 'textfield', // For Firefox
	};

	const quantityButtonStyle = {
		textAlign: 'center',
		background: '#ADD8E6',
		margin: '1px',
		cursor: 'pointer',
	};

	const quantityNavStyle = {
		position: 'relative',
		top: len - 15,
	};

	const handleChange = (e) => {
		let val = e.target.value;
		if (val === '') {
			setLength(0);
			changeArray(index, 0);
		} else {
			val = parseInt(val);
			if (val > 300) {
				setLength(300);
				changeArray(index, 300);
			} else if (val < 0) {
				setLength(0);
				changeArray(index, 0);
			} else {
				setLength(val);
				changeArray(index, val);
			}
		}
	};

	const increment = () => {
		if (len < 300) {
			setLength(len + 1);
			changeArray(index, len + 1);
		}
	};

	const decrement = () => {
		if (len > 0) {
			setLength(len - 1);
			changeArray(index, len - 1);
		}
	};

	return (
		<div style={barStyle}>
			<input
				type='number'
				style={textStyle}
				value={len}
				onChange={handleChange}
			/>
			<div style={quantityNavStyle}>
				<div
					style={quantityButtonStyle}
					onMouseOver={(e) => (e.currentTarget.style.opacity = '0.5')}
					onMouseOut={(e) => (e.currentTarget.style.opacity = '1')}
					onClick={increment}
				>
					+
				</div>
				<div
					style={quantityButtonStyle}
					onMouseOver={(e) => (e.currentTarget.style.opacity = '0.5')}
					onMouseOut={(e) => (e.currentTarget.style.opacity = '1')}
					onClick={decrement}
				>
					-
				</div>
			</div>
		</div>
	);
};

class App extends Component {
	state = {
		array: [],
		arraySteps: [],
		colorKey: [],
		colorSteps: [],
		timeouts: [],
		currentStep: 0,
		barCount: 10,
		delay: 300,
		algorithm: 'Bubble Sort',
	};

	ALGORITHMS = {
		'Bubble Sort': BubbleSort,
		'Merge Sort': MergeSort,
		'Quick Sort': QuickSort,
		'Insertion Sort': InsertionSort,
		'Selection Sort': SelectionSort,
	};

	componentDidMount() {
		this.generateBars();
		// Call riseText after the component has mounted
		riseText();
	}

	setTimeouts = () => {
		let steps = this.state.arraySteps;
		let colorSteps = this.state.colorSteps;

		this.clearTimeouts();
		let timeouts = [];

		let i = 0;

		while (i < steps.length - this.state.currentStep) {
			let timeout = setTimeout(() => {
				let currentStep = this.state.currentStep;
				this.setState({
					array: steps[currentStep],
					colorKey: colorSteps[currentStep],
					currentStep: currentStep + 1,
				});
				timeouts.push(timeout);
			}, this.state.delay * i);
			i++;
		}

		this.setState({
			timeouts: timeouts,
		});
	};

	changeAlgorithm = (e) => {
		this.clearTimeouts();
		this.clearColorKey();
		this.setState(
			{
				algorithm: e.target.value,
				currentStep: 0,
				arraySteps: [
					this.state.arraySteps[
					this.state.currentStep === 0 ? 0 : this.state.currentStep - 1
					],
				],
			},
			() => this.generateSteps()
		);
	};

	clearTimeouts = () => {
		this.state.timeouts.forEach((timeout) => clearTimeout(timeout));
		this.setState({ timeouts: [] });
	};

	clearColorKey = () => {
		let blankKey = new Array(this.state.barCount).fill(0);
		this.setState({ colorKey: blankKey, colorSteps: [blankKey] });
	};

	stepBack = () => {
		let currentStep = this.state.currentStep;

		if (currentStep === 0) return;
		this.clearTimeouts();
		currentStep -= 1;
		this.setState({
			array: this.state.arraySteps[currentStep],
			colorKey: this.state.colorSteps[currentStep],
			currentStep: currentStep,
		});
	};

	stepForward = () => {
		let currentStep = this.state.currentStep;

		if (currentStep >= this.state.arraySteps.length - 1) return;
		this.clearTimeouts();
		currentStep += 1;
		this.setState({
			array: this.state.arraySteps[currentStep],
			colorKey: this.state.colorSteps[currentStep],
			currentStep: currentStep,
		});
	};

	generateSteps = () => {
		let array = this.state.array.slice();
		let steps = this.state.arraySteps.slice();
		let colorSteps = this.state.colorSteps.slice();

		this.ALGORITHMS[this.state.algorithm](array, 0, steps, colorSteps);

		this.setState({
			arraySteps: steps,
			colorSteps: colorSteps,
		});
	};

	generateRandomNumber = (min, max) => {
		return Math.floor(Math.random() * (max - min) + min);
	};

	generateBars = () => {
		this.clearTimeouts();
		this.clearColorKey();

		let barCount = this.state.barCount;
		let arr = [];

		for (let i = 0; i < barCount; i++) {
			arr.push(this.generateRandomNumber(50, 250));
		}

		this.setState(
			{
				array: arr,
				arraySteps: [arr],
				barCount: barCount,
				currentStep: 0,
			},
			() => this.generateSteps()
		);
	};

	changeArray = (index, value) => {
		let array = this.state.array;
		array[index] = value;
		console.log(array);
		this.setState(
			{
				array: array,
				arraySteps: [array],
				currentStep: 0,
			},
			() => this.generateSteps()
		);
	};

	changeBarCount = (e) => {
		this.clearTimeouts();
		this.clearColorKey();
		this.setState(
			{
				barCount: parseInt(e.target.value),
			},
			() => this.generateBars()
		);
	};

	changeSpeed = (e) => {
		this.clearTimeouts();
		this.setState({
			delay: parseInt(e.target.value),
		});
	};

	render() {
		let barsDiv = this.state.array.map((value, index) => (
			<Bar
				key={index}
				index={index}
				length={value}
				color={this.state.colorKey[index]}
				changeArray={this.changeArray}
			/>
		));
		let playButton;

		if (this.state.arraySteps.length === this.state.currentStep) {
			playButton = (
				<button className='controller' onClick={this.generateBars}>
					<RotateLeft />
				</button>
			);
		} else {
			playButton = (
				<button className='controller' onClick={this.setTimeouts}>
					<Play />
				</button>
			);
		}

		return (
			<body>
				<div className='page-container'>
					<div className='content-wrap'>
						<div className='App'>
							<div className='innerwrap'>
								<h1 className='page-header_title risetext'>
									<span className='page-header_title-main enclose'>
										Sorting Visualizer
									</span>
								</h1>

								<div className='frame'>
									<div className='barsDiv container'>{barsDiv}</div>
								</div>

								<div className='control-pannel'>
									<div className='control-buttons'>
										<button className='controller' onClick={this.stepBack}>
											<Backward />
										</button>

										{playButton}

										<button className='controller' onClick={this.stepForward}>
											<Forward />
										</button>
									</div>
								</div>

								<div className='pannel'>
									<Form
										formLabel='Algorithms'
										values={[
											'Bubble Sort',
											'Merge Sort',
											'Quick Sort',
											'Insertion Sort',
											'Selection Sort',
										]}
										labels={[
											'Bubble Sort',
											'Merge Sort',
											'Quick Sort',
											'Insertion Sort',
											'Selection Sort',
										]}
										currentValue={this.state.algorithm}
										onChange={this.changeAlgorithm}
									/>
									<Form
										formLabel='Items'
										values={[10, 15, 20, 25, 30]}
										labels={[10, 15, 20, 25, 30]}
										currentValue={this.state.barCount}
										onChange={this.changeBarCount}
									/>
									<Form
										formLabel='Speed'
										values={[500, 400, 300, 200, 100]}
										labels={['1x', '2x', '3x', '4x', '5x']}
										currentValue={this.state.delay}
										onChange={this.changeSpeed}
									/>
								</div>
							</div>
						</div>
					</div>
					<footer className='footer'>
						Created by Mobenul Haq -{' '}
						<a href='https://mobenh.com/' target='_blank' rel='noreferrer'>
							mobenh.com
						</a>
					</footer>
				</div>
			</body>
		);
	}
}

export default App;