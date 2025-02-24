const Info = () => {
  return (
    <div className="frosted-card text-center">
      <h2 className="">Cómo usar la app</h2>
      {/* Agrega instrucciones reales, como permitir acceso a la ubicación o ingresar tu código postal */}
      <p className="">Ingresa tu código postal para encontrar tiendas cerca de ti.</p>
      <p>Códigos postales de prueba:</p>
      <ul>
        <li>35002</li>
        <li>35212</li>
        <li>35100</li>
      </ul>
    </div>
  );
};

export default Info;
