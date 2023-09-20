export default function Blog() {
  //move delete button to card

  return (
    <main className="h-full min-h-screen">
      <h1>Watch this space, as they say.</h1>
      <svg
        width="400"
        height="100"
        xmlns="http://www.w3.org/2000/svg">
        <text
          x="20"
          y="50"
          font-family="Arial"
          font-size="30"
          fill="black">
          YOURBOOK
        </text>

        <text
          x="180"
          y="50"
          font-family="Arial"
          font-size="20"
          fill="black"
          opacity="0.6">
          of
        </text>

        <text
          x="200"
          y="50"
          font-family="Arial"
          font-size="30"
          fill="black">
          RECIPES
        </text>
      </svg>
    </main>
  );
}
