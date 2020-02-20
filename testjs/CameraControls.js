var CameraControls = function (camera) {
	camera.rotation.set(0, 0, 0);
	let pitchObject = new THREE.Object3D();
	pitchObject.add(camera);

	var yawObject = new THREE.Object3D();
	yawObject.add(pitchObject);

	let movementX = 0;
	let movementY = 0;
	let mouseclik = false;
	window.addEventListener('resize', onWindowResize, false);
	/**
	 * 鼠标滚轮控制FOV。
	 **/
	var onMouseWheel =function (event) {
		//event.preventDefault();
		event.stopPropagation();
		if (event.deltaY > 0) {
			increaseFOV = true;
		} else if (event.deltaY < 0) {
			decreaseFOV = true;
		}
	}
	document.getElementById("container").addEventListener('wheel', onMouseWheel, false);

	/**
	 * 鼠标按下click = true。
	 **/
	var mouseDown = function () {
		mouseclik = true;
		/*document.getElementById("container").style.cursor ="none"*/
	}
	document.getElementById("container").addEventListener('mousedown', mouseDown, false);
	/**
	 * 鼠标松开click = false。
	 **/
	var onMouseUp = function () {
		mouseclik = false;
		/*document.getElementById("container").style.cursor ="default"*/
	}
	document.body.addEventListener('mouseup', onMouseUp, false);


	var onMouseMove = function (event) {

		if (isPaused = true && mouseclik) {

			movementX = event.movementX || event.mozMovementX || 0;
			movementY = event.movementY || event.mozMovementY || 0;

			yawObject.rotation.y -= movementX * 0.002;
			pitchObject.rotation.x -= movementY * 0.002;
			// clamp the camera's vertical movement (around the x-axis) to the scene's 'ceiling' and 'floor'
			pitchObject.rotation.x = Math.max(-PI_2, Math.min(PI_2, pitchObject.rotation.x));
		}

	};
	document.body.addEventListener('mousemove', onMouseMove, false);

	this.getObject = function () {

		return yawObject;

	};

	this.getYawObject = function () {

		return yawObject;

	};

	this.getPitchObject = function () {

		return pitchObject;

	};

	this.getDirection = function () {

		var te = pitchObject.matrixWorld.elements;

		return function (v) {

			v.set(te[8], te[9], te[10]).negate();

			return v;

		};

	}();

	this.getUpVector = function () {

		var te = pitchObject.matrixWorld.elements;

		return function (v) {

			v.set(te[4], te[5], te[6]);

			return v;

		};

	}();

	this.getRightVector = function () {

		var te = pitchObject.matrixWorld.elements;

		return function (v) {

			v.set(te[0], te[1], te[2]);

			return v;

		};

	}();
};
