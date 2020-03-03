import osmnx as ox
import networkx as nx


def gdf_linestrings_to_geojson(df, properties):
    geojson = {"type": "FeatureCollection", "features": []}
    for _, row in df.iterrows():
        feature = {
            "type": "Feature",
            "properties": {},
            "geometry": {
                "type": "LineString",
                "coordinates": [list(coord) for coord in (row["geometry"].coords)],
            },
        }
        for prop in properties:
            feature["properties"][prop] = row[prop]
        geojson["features"].append(feature)
    return geojson


def retrieve_value(analysis_dict, row):
    value = analysis_dict[(row["u"], row["v"])]
    return value


def retrieve_value_key(analysis_dict, row):
    value = analysis_dict[(row["u"], row["v"], row["key"])]
    return value


def integration_linegraph_analysis(G):
    L = nx.line_graph(G)
    integration_dict = nx.closeness_centrality(L)
    return integration_dict, retrieve_value_key


def betweenness_edge_analysis(G):
    betweenness_dict = nx.edge_betweenness_centrality(G)
    return betweenness_dict, retrieve_value


analyses = {
    "integration": integration_linegraph_analysis,
    "betweenness": betweenness_edge_analysis,
}


def get_geojson(bounds, network_type, analysis_type):
    G = ox.graph_from_bbox(**bounds, network_type=network_type)
    analysis_dict, retrieve_value = analyses[analysis_type](G)

    gdf = ox.graph_to_gdfs(G, nodes=False, edges=True)

    max_value = max(analysis_dict.values())
    min_value = min(analysis_dict.values())
    adjusted_max = max_value - min_value

    gdf["value"] = gdf.apply(lambda row: retrieve_value(analysis_dict, row), axis=1)
    gdf["valueNormalized"] = gdf.apply(
        lambda row: (retrieve_value(analysis_dict, row) - min_value) / adjusted_max,
        axis=1,
    )

    return gdf_linestrings_to_geojson(gdf, ["value", "valueNormalized"])
