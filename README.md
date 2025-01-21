# AR-experience
## WebAR with OpenCV
This project is a fork of the original AR-experience project. It is based on [React]([https://](https://react.dev/)) and [OpenCV]([https://](https://opencv.org/)) for WebAR, providing enhanced capabilities for augmented reality experiences on the web.
The project was ported to [Vite]([https://](https://vite.dev/)), because it has much feature and most updated. We plan to update also OpenCV to a more recent version in a near future.

## Compiling OpenCV

For proper operation on desktop and mobile devices, the combination of 1.40.1 and OpenCV 3.4.13 works well.

The build is performed with the following command (CentOS 8):
```
emcmake python3 ./opencv/platforms/js/build_js.py build_wasm --build_wasm --build_flags="-s USE_PTHREADS=0 -O3"
```

