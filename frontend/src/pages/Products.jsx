import API from "../api/axios";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

function Products(){
    const [products, setProducts] = useState([]);
    const [form, setForm] = useState({
        name: "",
        description: "",
        product_type_id: "",
        available_qty: "",
        price: ""
    });
    const [image, setImage] = useState(null);

    const fetchProducts = async()=> {
        const res = await API.get("/products")
        setProducts(res.data);
    };

    useEffect(()=> {
        fetchProducts();
    }, []);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async () => {
        const formData = new FormData();

        Object.keys(form).forEach(key=>{
            formData.append(key, form[key])
        });

        if (image){
            formData.append("image", image);
        }

        await API.post("/products", formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });

        setForm({
            name: "",
            description: "",
            product_type_id: "",
            available_qty: "",
            price: ""
        });
        setImage(null);
        fetchProducts();
    }
    
    return(
        <div>
            <Navbar></Navbar>
            <div className="container mt-4">
                <div className="card shadow-sm">
                    <div className="card-header bg-dark text-white">
                        Create Product
                    </div>

                    <div className="card-body row g-3">
                        <div className="col-md-4">
                            <label htmlFor="">Name</label>
                            <input type="text" className="form-control" name="name" value={form.name} onChange={handleChange} />
                        </div>
                        <div className="col-md-4">
                            <label htmlFor="">Price</label>
                            <input type="number" className="form-control" name="price" value={form.price} onChange={handleChange} />
                        </div>
                        <div className="col-md-4">
                            <label htmlFor="">Available Quantity</label>
                            <input type="number" className="form-control" name="available_qty" value={form.available_qty} onChange={handleChange} />
                        </div>
                        <div className="col-md-4">
                            <label htmlFor="">Product Type ID</label>
                            <input type="number" className="form-control" name="product_type_id" value={form.product_type_id} onChange={handleChange} />
                        </div>
                        <div className="col-md-4">
                            <label htmlFor="">Description</label>
                            <textarea className="form-control" name="description" value={form.description} onChange={handleChange} />
                        </div>
                        <div className="col-md-4">
                            <label htmlFor="">Image</label>
                            <input type="file" className="form-control" onChange={(e) => setImage(e.target.files[0])} />
                        </div>

                        <div className="col-md-4">
                            <button className="btn btn-success" onClick={handleSubmit}>
                                Create Product
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mt-5">
                <div className="card shadow-sm">
                    <div className="card-header bg-dark text-white">
                        Product List
                    </div>

                    <div className="card-body table-responsive">
                        <table className="table table-bordered-table-hover">
                            <thead className="table-dark">
                                <tr>
                                    <th>Name</th>
                                    <th>Price</th>
                                    <th>Available Qty</th>
                                    <th>Images</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map(p=>(
                                    <tr key={p.id}>
                                        <td>{p.name}</td>
                                        <td>{p.price}</td>
                                        <td>{p.available_qty}</td>
                                        <td>                                            
                                            {p.image && (
                                                <img src={`http://127.0.0.1:8000/uploads/${p.image}`} alt="" width="60" />
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Products;