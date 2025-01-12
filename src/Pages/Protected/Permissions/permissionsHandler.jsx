import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Button, TextField, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import { Delete, Edit, Search } from '@mui/icons-material';
import { APIUsers } from "./../../../Services/BaseService/index";
import { getToken, getUser } from "./../../../Services/Functions/loader";
import { checkAction } from '../../../Utils/permission';


const PermissionCRUD = () => {
  const [permissions, setPermissions] = useState([]);
  const [form, setForm] = useState({ name: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);

  const canCreate = checkAction(permissions, "permissoes_criar");
  const canUpdate = checkAction(permissions, "permissoes_editar");
  const canDelete = checkAction(permissions, "permissoes_deletar");
  const canView = checkAction(permissions, "permissoes_visualizar");

  useEffect(() => {
    fetchPermissions();
  }, []);

  const fetchPermissions = async () => {
    try {
      const response = await APIUsers.get('permission',
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          }
        });
      setPermissions(response.data);
    } catch (error) {
      console.error('Error fetching permissions:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await APIUsers.patch(`permission/patch/${editId}`, form,
          {
            headers: {
              Authorization: `Bearer ${getToken()}`,
            }
          });
      } else {
        await APIUsers.post('permission/create/', form);
      }
      setForm({ name: '' });
      setEditId(null);
      fetchPermissions();
    } catch (error) {
      console.error('Error saving permission:', error);
    }
  };

  const handleEdit = (permission) => {
    setForm({ name: permission.name });
    setEditId(permission._id);
  };

  const handleDelete = async (id) => {
    try {
      await APIUsers.delete(`permission/delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          }
        });
      fetchPermissions();
    } catch (error) {
      console.error('Error deleting permission:', error);
    }
  };

  const handleSearch = async () => {
    try {
      const response = await APIUsers.get(`permissions/search`,
        { name: searchQuery },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          }
        }
      );
      setPermissions(response.data);
    } catch (error) {
      console.error('Error searching permissions:', error);
    }
  };

  const filteredPermissions = permissions.filter((permission) =>
    permission.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Permission Management
      </Typography>
      {canCreate && (

        <Box component="form" onSubmit={handleSubmit} sx={{ marginBottom: 4 }}>
          <TextField
            label="Permission Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            fullWidth
            margin="normal"
          />
          <Button sx={{ backgroundColor: '#ae883c', '&:hover': { backgroundColor: '#936d30' } }} type="submit" variant="contained" color="primary">
            {editId ? 'Atualizar Permissão' : 'Criar Permissão'}
          </Button>
        </Box>
      )}
      <TableContainer component={Paper}>
        <Table sx={{ backgroundColor: '#eae3d7', '&:hover': { backgroundColor: '#eae3d7' } }}>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              {(canUpdate || canDelete) && (
                <TableCell>Actions</TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPermissions.map((permission, index) => (
              <TableRow key={permission._id}>
                <TableCell>{permission.name}</TableCell>
                <TableCell>
                  {canUpdate && (
                    <IconButton color="primary" onClick={() => handleEdit(permission)}>
                      <Edit />
                    </IconButton>
                  )}
                  {canDelete && (
                    <IconButton color="error" onClick={() => handleDelete(permission._id)}>
                      <Delete />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default PermissionCRUD;
