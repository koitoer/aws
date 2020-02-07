function gqlQuery (query, variables, authenticated) {
  const target = `${apiGPrefix}gql`
  return withToken().then(token => {
    return fetch(target, {
      method: 'post',
      mode: 'cors',
      body: JSON.stringify({query: query, variables: variables}),
      headers: new Headers({
        'Accept': 'application/json',
        'Authorization': token
      })
    })
  }).then(response => {
    if (response.status === 200) { return response.json() }

    console.log(response)
    throw `Bad status code ${response.status}`
  }).catch(err => {
    console.log('Sad days: ' + err)
  })
}
