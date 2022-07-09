from crypt import methods
from flask import Flask, jsonify, request, make_response
import flask_cors

import base64 
from PIL import Image
from skimage import io, img_as_ubyte                  # image manipulation
from sklearn.cluster import KMeans      # ml algorithm
import numpy as np                      # matrix manipulation
from io import BytesIO


app = Flask(__name__)
flask_cors.CORS(app, resources={r'/*': {'origins': '*'}})


def main():
    app.run(host="0.0.0.0", port=5000, debug=True)

'''
    decode base64 string to img data containing ndarray pixels
'''
def base64_to_img(base64_string):
    if isinstance(base64_string, bytes):
        base64_string = base64_string.decode("utf-8")

    imgdata = base64.b64decode(base64_string)
    img = io.imread(imgdata, plugin='imageio')
    # io.imshow(img)
    rows = img.shape[0]
    cols = img.shape[1]

    # print(f'''
    # Dimension of Images:
    # image shape: {img.shape}
    # rows(height): {rows}
    # cols(width): {cols}
    # '''
    # )

    img = img.reshape(rows*cols, 3)

    return img, rows, cols

'''
    encode img pixel data to base64 string
'''
def img_to_base64(image) -> str:

    # convert image to bytes
    with BytesIO() as output_bytes:
        PIL_image = Image.fromarray(img_as_ubyte(image))
        PIL_image.save(output_bytes, 'JPEG')
        bytes_data = output_bytes.getvalue()

    # encode bytes to base64 string
    base64_str = str(base64.b64encode(bytes_data), 'utf-8')
    return base64_str


def compress_image(img, k, nb_row, nb_col):
  kmeans = KMeans(n_clusters=k)
  kmeans.fit(img)
  return np.clip(kmeans.cluster_centers_[kmeans.labels_].astype('uint8'), 0, 255).reshape(nb_row, nb_col, 3)




@app.route("/compress", methods=["POST"])
def compress():
    base64data = request.json.get('imageData')
    k = request.json.get('nbClusters')
    if base64data and k:
        try:
            image_array, nb_rows, nb_cols = base64_to_img(base64data)
            compressed = compress_image(image_array, k, nb_rows, nb_cols)
            base64Compressed = img_to_base64(compressed)
            return make_response({"compressedData": str(base64Compressed)}, 200)
        except Exception as e:
            return make_response(f"Error: could not compress image ", 500)
    else:
       return  make_response("Invalid request - provide image data and number of clusters", 400)


if __name__ == "__main__":
    main()