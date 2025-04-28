from flask import Flask, render_template, session

app = Flask(__name__)
app.secret_key = "calculator_secret_key"


@app.route('/', methods=['GET'])
def calculator():
    if 'display' not in session:
        session['display'] = ''

    return render_template('index.html', display=session['display'])


if __name__ == '__main__':
    app.run(debug=True)
