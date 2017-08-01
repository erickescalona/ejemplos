package ve.gob.cne.sarc.catalogo.core.catalogo.business;

import java.util.List;
import ve.gob.cne.sarc.comunes.catalogo.ComunidadIndigena;

/**
 * ComunidadIndigenaBF.java
 * @descripcion Interfaz del catalogo Comunidad Indigena
 * @version 1.0 11/5/2016
 * @author Anabell De Faria
 */ 
public interface ComunidadIndigenaBF {

    /**
     * Interfaz del metodo responsable de listar las Comunidades Indigenas
     *
     * @return Lista de {@link ComunidadIndigena}
     */
    List<ComunidadIndigena> consultarTodos();
}
