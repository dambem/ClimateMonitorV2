import pandas as pd
import plotly.graph_objects as go
df = pd.read_csv('test.csv', sep=';')
fig = go.Figure()
fig.add_trace(go.Scatter(x = df['timestamp'], y = df['P1'],
                  name='P1 Value over time'))
fig.add_trace(go.Scatter(x = df['timestamp'], y = df['P2'],
                  name='P2 Value over time'))
fig.update_layout(title='P1 and P2 Value over time',
                   plot_bgcolor='rgb(230, 230,230)',
                   showlegend=True)

fig.show()